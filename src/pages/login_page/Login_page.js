import "./Login_page.css";

function LoginPage() {
    return (
        <main className="login-page">
            <section className="login-frame">
                <h2 className="login-title">로그인</h2>

                <div className="login-form">
                    <input className="login-input" placeholder="아이디" />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="비밀번호"
                    />
                    <button className="login-button">로그인</button>
                </div>

                <div className="login-footer">회원가입</div>
            </section>
        </main>
    );
}

export default LoginPage;
