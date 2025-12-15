import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>個人情報保護方針</h1>

                <p style={{ marginBottom: '1.5rem' }}>
                    当スクール（以下，「当社」といいます。）は，本ウェブサイト上で提供するサービス（以下，「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
                </p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第1条（収集する情報）</h2>
                    <p>当社は、本サービスの提供にあたり、以下の情報を収集します。</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>氏名、住所、電話番号、メールアドレス</li>
                        <li>ドローン操縦経験、保有資格情報</li>
                        <li>緊急連絡先情報</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第2条（利用目的）</h2>
                    <p>収集した情報は、以下の目的のために利用します。</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>本サービスの提供・運営（予約管理、本人確認）のため</li>
                        <li>ユーザーへのお知らせ、メンテナンス、重要なお知らせの通知のため</li>
                        <li>不正・不当な目的でサービスを利用しようとするユーザーの特定・対策のため</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第3条（第三者提供）</h2>
                    <p>当社は，法令に基づく場合を除き、あらかじめユーザーの同意を得ることなく、個人情報を第三者に提供することはありません。</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第4条（安全管理）</h2>
                    <p>当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。</p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第5条（お問い合わせ）</h2>
                    <p>本ポリシーに関するお問い合わせは，サイト内のお問い合わせフォームよりお願いいたします。</p>
                </section>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <a href="/register" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.5rem 2rem' }}>
                        登録画面に戻る
                    </a>
                </div>
            </div>
        </div>
    );
}
