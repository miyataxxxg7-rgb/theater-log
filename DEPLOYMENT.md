# デプロイ（アプリの公開）ガイド

このアプリをインターネット上に無料で公開し、スマホや友達のPCからアクセスできるようにする手順を解説します。
最も簡単で Next.js と相性の良い **Vercel（ヴェルセル）** というサービスを使用します。

## 概略
1. **GitHub** にコードをアップロードする
2. **Vercel** と GitHub を連携させる
3. アプリが自動的に公開される！

---

## ステップ 1：GitHub にコードをアップロードする

まず、あなたのコードを GitHub という「コード置き場」に保存します。

1. [GitHub](https://github.com/) にアクセスし、アカウントを作成（またはログイン）します。
2. 右上の「+」ボタンから **New repository** を選択します。
3. リポジトリ名（例：`theater-log`）を入力し、「Public」を選択して **Create repository** をクリックします。
4. プロジェクトのフォルダ（`C:\Users\miyat\.gemini\antigravity\scratch\theater-log`）で以下のコマンドを順番に実行します：
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/あなたのユーザー名/theater-log.git
   git push -u origin main
   ```
   *※「あなたのユーザー名」は自分のものに置き換えてください。*

## ステップ 2：Vercel で公開する

次に、Vercel というサービスを GitHub と繋いで、アプリを動かします。

1. [Vercel](https://vercel.com/) にアクセスし、「Continue with GitHub」でログインします。
2. ダッシュボードの **Add New...** > **Project** をクリックします。
3. 先ほど GitHub に作った `theater-log` リポジトリの横にある **Import** をクリックします。
4. 設定画面が出ますが、**そのまま「Deploy」ボタン**をクリックしてください。
   *※Next.js なので、Vercel が自動的に最適な設定（ビルドコマンドなど）を読み取ってくれます。*

## ステップ 3：アクセスして確認！

1. 数分待つと「Congratulations!」という画面が出ます。
2. 表示されたURL（例：`https://theater-log.vercel.app`）をクリックしてください。
3. **完成！** これで、自分だけでなく、スマホや友達にこのURLを送れば誰でも見ることができます。

---

## 補足：データの保存について
このアプリは現在、「ブラウザの保存領域（localStorage）」にデータを保存しています。
* **スマホで入力したデータ**は、そのスマホのブラウザに保存されます。
* **PCで入力したデータ**は、PCのブラウザに保存されます。
※異なるデバイス間でデータを同期させたい場合は、将来的にデータベース（Vercel Postgres 等）を導入する必要があります。

## 更新する方法
一度公開した後は、コードを変更して GitHub に `push`（アップロード）するだけで、Vercel が自動的に最新の状態にアプリを更新してくれます。
