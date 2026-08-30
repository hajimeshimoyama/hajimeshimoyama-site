<?php
// Contactフォームの送信先PHPスクリプト（Netlify Forms相当）。contact.astro から参照されている。

declare(strict_types=1);

$toAddress = 'pio@hajimeshimoyama.com';
$siteOrigin = 'https://hajimeshimoyama.com';

function redirectWithStatus(string $status): never {
    global $siteOrigin;
    header('Location: ' . $siteOrigin . '/contact/?status=' . $status, true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirectWithStatus('invalid');
}

// ハニーポット（bot-field）に値が入っていればスパムとみなし、成功したふりをして終了
$botField = trim($_POST['bot-field'] ?? '');
if ($botField !== '') {
    redirectWithStatus('sent');
}

// フォーム表示から3秒未満での送信はボットとみなし、成功したふりをして終了
$loadedAt = (int) ($_POST['loaded-at'] ?? 0);
if ($loadedAt > 0 && (time() - $loadedAt) < 3) {
    redirectWithStatus('sent');
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirectWithStatus('invalid');
}

// メッセージ内にURLが2つ以上あるものはスパムとみなし、成功したふりをして終了
if (preg_match_all('/https?:\/\//i', $message) >= 2) {
    redirectWithStatus('sent');
}

$subject = '[hajimeshimoyama.com] お問い合わせ: ' . mb_substr($name, 0, 50);
$body = "名前: {$name}\nメールアドレス: {$email}\n\nメッセージ:\n{$message}\n";

// 送信者表示名に問い合わせ者の名前を入れることで、受信一覧で見分けやすくする
$fromDisplayName = mb_encode_mimeheader($name . ' (via hajimeshimoyama.com)', 'UTF-8');

$headers = [
    'From: ' . $fromDisplayName . ' <no-reply@hajimeshimoyama.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($toAddress, mb_encode_mimeheader($subject, 'UTF-8'), $body, implode("\r\n", $headers));

redirectWithStatus($sent ? 'sent' : 'error');
