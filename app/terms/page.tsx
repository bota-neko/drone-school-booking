import React from 'react';

export default function TermsPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>利用規約</h1>

                <p style={{ marginBottom: '1.5rem' }}>
                    この利用規約（以下，「本規約」といいます。）は，当スクール（以下，「当社」といいます。）が提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
                </p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第1条（適用）</h2>
                    <p>本規約は，ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第2条（利用登録）</h2>
                    <p>登録希望者が当社の定める方法によって利用登録を申請し，当社がこれを承認することによって，利用登録が完了するものとします。</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第3条（禁止事項）</h2>
                    <p>ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>法令または公序良俗に違反する行為</li>
                        <li>犯罪行為に関連する行為</li>
                        <li>当社のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為</li>
                        <li>航空法および関連法規制を遵守しないドローン飛行</li>
                        <li>他のユーザーに対する危険な飛行行為</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第4条（利用停止）</h2>
                    <p>ユーザーが本規約に違反した場合、またはその他当社が不適切と判断した行為を行った場合、事前の通知なくユーザーの利用を停止することができるものとします。</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第5条（免責事項）</h2>
                    <p>
                        当社の債務不履行責任は，当社の故意または重過失によらない場合には免責されるものとします。<br />
                        本サービスの利用に伴うドローン飛行中の事故、破損、第三者への損害について、当社は一切の責任を負いません。
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>第6条（準拠法・裁判管轄）</h2>
                    <p>本規約の解釈にあたっては，日本法を準拠法とします。本サービスに関して紛争が生じた場合には，当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</p>
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
