---
allowed-tools: Bash(git:*), AskUserQuestion
description: "worktreeと作業ブランチをクリーンアップします"
---

# Custom Command: End Development

開発が完了したブランチをクリーンアップします。
worktree 環境と通常ブランチ環境の両方に対応しています。

## 前提条件

- PR がマージ済みであること
- 作業が完了していること

## 実行手順

### 1. 環境の判定

以下のコマンドで worktree 環境かどうかを判定してください：

```bash
git worktree list
```

- **worktree が2つ以上**: worktree 環境 → 「Worktree 環境の手順」へ
- **worktree が1つのみ（メインのみ）**: 通常ブランチ環境 → 「通常ブランチ環境の手順」へ

### 2. 現在の状態確認

```bash
git status
git branch --show-current
```

未コミットの変更がある場合は、ユーザーに警告してください：
「未コミットの変更があります。クリーンアップを続行しますか？」

---

## Worktree 環境の手順

worktree 内から自分自身を削除することはできないため、ユーザーへの案内を出力します。

### 案内の出力

以下の形式で案内を出力してください：

```
🧹 Worktree クリーンアップ手順

現在のディレクトリ: {現在のパス}
ブランチ: {現在のブランチ}

このセッションを終了し、メインリポジトリで以下を実行してください:

1. Claude を終了（Ctrl+C または /exit）

2. メインリポジトリに移動:
   cd {メインリポジトリのパス}

3. Worktree を削除:
   git worktree remove {現在のworktreeパス}

4. ブランチを削除（必要に応じて）:
   git branch -d {現在のブランチ名}

5. 確認:
   git worktree list
   git branch -a
```

---

## 通常ブランチ環境の手順

同一ディレクトリ内でクリーンアップを実行します。

### 1. main ブランチに切り替え

```bash
git switch main
```

### 2. 最新の変更を取得

```bash
git pull
```

### 3. 作業ブランチを削除

```bash
git branch -d {作業ブランチ名}
git push origin --delete {作業ブランチ名}
```

### 4. 確認

```bash
git branch -a
```

main 以外にブランチがないことを確認し、結果をユーザーに報告してください。

---

## 注意事項

- worktree 内から自分自身を削除することはできない
- 必ずメインリポジトリから worktree 削除コマンドを実行する
- PR がマージされていない場合は警告を出す
