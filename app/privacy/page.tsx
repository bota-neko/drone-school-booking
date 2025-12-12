export default function PrivacyPage() {
    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-outfit)', fontWeight: 700 }}>個人情報保護方針</h1>
            <div className="card">
                <p>ここに個人情報保護方針の本文が入ります。</p>
                <p>（正式な方針文言は別途ご用意ください）</p>
                <br />
                <h3>1. 個人情報の収集</h3>
                <p>当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレスなどの個人情報をお尋ねすることがあります。</p>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={() => window.close()} className="btn btn-primary">閉じる</button>
            </div>
        </div>
    );
}
