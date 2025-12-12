'use client';

export default function TermsPage() {
    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-outfit)', fontWeight: 700 }}>利用規約</h1>
            <div className="card">
                <p>ここに利用規約の本文が入ります。</p>
                <p>（正式な規約文言は別途ご用意ください）</p>
                <br />
                <h3>第1条（適用）</h3>
                <p>本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
                {/* Add more placeholder content as needed */}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={() => window.close()} className="btn btn-primary">閉じる</button>
            </div>
        </div>
    );
}
