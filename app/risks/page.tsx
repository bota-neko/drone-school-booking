'use client';

'use client';

export default function TermsPage() {
    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-outfit)', fontWeight: 700 }}>リスク説明・同意事項</h1>
            <div className="card">
                <p>ドローンの操縦には固有のリスクが伴います。以下の事項を十分にご理解いただき、同意の上でご参加ください。</p>
                <br />
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>シミュレータによる「VR酔い」が発生する可能性があります。</li>
                    <li>実機（マイクロドローン）は高速回転するプロペラを持っており、接触すると怪我をする恐れがあります。</li>
                    <li>インストラクターの指示に必ず従ってください。</li>
                    <li>機材の破損については、故意または重過失がある場合を除き、原則としてスクール側の負担としますが、状況により相談させていただく場合があります。</li>
                </ul>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={() => window.close()} className="btn btn-primary">閉じる</button>
            </div>
        </div>
    );
}
