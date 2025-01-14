import gspread
from google.oauth2.service_account import Credentials
import os
import re
from collections import defaultdict

# Google API認証情報
SERVICE_ACCOUNT_FILE = 'credentials.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
SPREADSHEET_ID = '1c0-wninITtqnhLebx_YtybtgnTcDIQqc9Hj2IYADjnY'  # スプレッドシートID
WORKSHEET_NAME = 'Sheet1'
CACHE_DIR = './cache'

# ファイル名解析
def parse_filename(filename):
    """
    ファイル名を解析して情報を抽出
    {制作年}_{クライアント名}_{プロジェクト名}_{作品名}_{種類}_{番号}.拡張子
    """
    match = re.match(r"^(\d{4})_([\w\s!+&-]+?)_(.+?)_(.+?)_(.+?)_(\d{2})\.(png|jpg|jpeg)$", filename, re.IGNORECASE)
    if not match:
        print(f"ルール違反のファイル名: {filename}")
        return None
    制作年, クライアント名, プロジェクト名, 作品名, 種類, 番号 = match.groups()[:6]
    return {
        "制作年": 制作年,
        "クライアント名": クライアント名,
        "プロジェクト名": プロジェクト名,
        "作品名": 作品名,
        "種類": 種類,
        "番号": 番号,
        "ファイル名": filename
    }

# ファイルをグループ化
def group_files_by_metadata(files):
    grouped = defaultdict(list)
    for file in files:
        metadata = parse_filename(file)
        if metadata:
            key = (metadata["制作年"], metadata["クライアント名"], metadata["プロジェクト名"], metadata["作品名"], metadata["種類"])
            grouped[key].append(metadata)
    return grouped

# スプレッドシートに記録
def add_to_spreadsheet(grouped_files):
    print("スプレッドシートに接続中...")
    gc = gspread.service_account(filename=SERVICE_ACCOUNT_FILE)
    sh = gc.open_by_key(SPREADSHEET_ID)
    worksheet = sh.worksheet(WORKSHEET_NAME)

    # 既存データの確認
    existing_data = worksheet.get_all_values()
    if existing_data:
        existing_links = {row[2] for row in existing_data[1:] if len(row) > 2 and row[2]}
    else:
        existing_links = set()

    # データ追加
    new_rows = []
    for key, files in grouped_files.items():
        制作年, クライアント名, プロジェクト名, 作品名, 種類 = key
        post_content = f"{クライアント名} “{プロジェクト名}” #{作品名.lower()} #{種類.lower()} #adesigner #y{制作年}"
        links = [f"./cache/{file['ファイル名']}" for file in files]
        links += [''] * (4 - len(links))  # 最大4列にする
        new_rows.append([post_content, '', *links, ''])

    if new_rows:
        worksheet.append_rows(new_rows)
        print(f"{len(new_rows)} 件の新規データをスプレッドシートに追加しました。")
    else:
        print("追加するデータはありません。")

# メイン処理
def main():
    if not os.path.exists(CACHE_DIR):
        print(f"キャッシュディレクトリが見つかりません: {CACHE_DIR}")
        return

    files = [f for f in os.listdir(CACHE_DIR) if os.path.isfile(os.path.join(CACHE_DIR, f))]
    grouped_files = group_files_by_metadata(files)

    if not grouped_files:
        print("処理可能なファイルがありません。")
        return

    add_to_spreadsheet(grouped_files)

if __name__ == "__main__":
    main()
