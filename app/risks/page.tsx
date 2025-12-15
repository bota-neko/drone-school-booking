import React from 'react';

export default function RisksPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #fee2e2' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#dc2626' }}>リスク説明・安全ガイドライン</h1>

                <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', color: '#b91c1c' }}>
                    <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        ドローンの利用には、予期せぬ事故や怪我のリスクが伴います。<br />
                        本サービスを利用する前に、以下のリスクおよび注意事項を必ずご確認ください。
                    </p>
                </div>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>1. 法令遵守の義務</h2>
                    <p>
                        利用者は、日本国の航空法、電波法、およびその他の関連法規を遵守する必要があります。
                        特に、人口集中地区（DID地区）での飛行、夜間飛行、目視外飛行などについては、国土交通省の許可・承認が必要な場合があります。
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>2. 事故・怪我のリスク</h2>
                    <p>
                        強風、バッテリー切れ、通信障害、操作ミスなどにより、ドローンが墜落・衝突するリスクがあります。
                        プロペラによる怪我や、機体の落下による第三者への損害が発生する可能性があります。
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>3. 賠償責任</h2>
                    <p>
                        利用中の事故により第三者の身体や財産に損害を与えた場合、その損害賠償責任は利用者が負うものとします。
                        当スクールでは、利用者自身の操縦による事故について一切の責任を負いません。
                        <br /><br />
                        <strong>※賠償責任保険への加入を強く推奨いたします。</strong>
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>4. 安全管理措置</h2>
                    <p>利用者は以下の安全管理措置を講じる義務があります。</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>飛行前の機体点検（プロペラ、バッテリー、通信状況）</li>
                        <li>周囲の安全確認（人、障害物、他のドローン）</li>
                        <li>補助者の配置（必要に応じて）</li>
                        <li>緊急時の着陸手順の確認</li>
                    </ul>
                </section>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>上記のリスクを理解し、安全な飛行を心がけてください。</p>
                    <a href="/register" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.5rem 2rem' }}>
                        同意して登録画面に戻る
                    </a>
                </div>
            </div>
        </div>
    );
}
