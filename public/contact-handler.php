<?php
// XServer移行時にContactフォームの送信先として使うPHPスクリプト（Netlify Forms相当）。
// 現時点では未使用（contact.astro からは参照していない）。移行を実行する段階で配線する。

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

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirectWithStatus('invalid');
}

$subject = '[hajimeshimoyama.com] お問い合わせ: ' . mb_substr($name, 0, 50);
$body = "名前: {$name}\nメールアドレス: {$email}\n\nメッセージ:\n{$message}\n";

$headers = [
    'From: no-reply@hajimeshimoyama.com',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($toAddress, mb_encode_mimeheader($subject, 'UTF-8'), $body, implode("\r\n", $headers));

redirectWithStatus($sent ? 'sent' : 'error');
