import { useState } from "react";
import "./My_page.css";

export default function MyPage() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        university: "",
        club: "",
        phone1: "",
        phone2: "",
        phone3: "",
        email: "",
    });

    const [openSection, setOpenSection] = useState(null);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
    };

    const toggle = (key) => {
        setOpenSection((prev) => (prev === key ? null : key));
    };

    return (
        <div className="mypage">
            <section className="info">
                <div className="infoHeader">
                    <div className="profileWrap">
                        <div className="profileCircle" />
                        <button className="profileEditBtn" type="button" />
                    </div>
                    <h2 className="title">내 정보</h2>
                </div>

                <div className="divider" />

                <form className="form" onSubmit={onSubmit}>
                    <div className="formGrid">
                        <div className="col">
                            <Field label="이름">
                                <input name="name" value={form.name} onChange={onChange} />
                            </Field>

                            <Field label="아이디">
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={onChange}
                                />
                            </Field>

                            <Field label="비밀번호">
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={onChange}
                                />
                            </Field>
                        </div>

                        <div className="col">
                            <Field label="대학">
                                <input
                                    name="university"
                                    value={form.university}
                                    onChange={onChange}
                                />
                            </Field>

                            <Field label="동아리">
                                <input name="club" value={form.club} onChange={onChange} />
                            </Field>

                            <Field label="전화번호" noControl>
                                <div className="phoneRow">
                                    <input
                                        className="phone"
                                        name="phone1"
                                        value={form.phone1}
                                        onChange={onChange}
                                    />
                                    <span className="dash">-</span>
                                    <input
                                        className="phone"
                                        name="phone2"
                                        value={form.phone2}
                                        onChange={onChange}
                                    />
                                    <span className="dash">-</span>
                                    <input
                                        className="phone"
                                        name="phone3"
                                        value={form.phone3}
                                        onChange={onChange}
                                    />
                                </div>
                            </Field>

                            <Field label="Email">
                                <input name="email" value={form.email} onChange={onChange} />
                            </Field>
                        </div>
                    </div>

                    <div className="submitRow">
                        <button className="submitBtn" type="submit">
                            수정하기
                        </button>
                    </div>
                </form>
            </section>

            <section className="accordions">
                <div className="divider" />

                <AccordionRow
                    title="동아리원 리스트 관리"
                    open={openSection === "members"}
                    onToggle={() => toggle("members")}
                >
                    <div className="accordionBody"></div>
                </AccordionRow>

                <AccordionRow
                    title="제안한 매치업 내역"
                    open={openSection === "sentM"}
                    onToggle={() => toggle("sentM")}
                >
                    <div className="accordionBody"></div>
                </AccordionRow>

                <AccordionRow
                    title="제안 받은 매치업 내역"
                    open={openSection === "receivedM"}
                    onToggle={() => toggle("receivedM")}
                >
                    <div className="accordionBody"></div>
                </AccordionRow>
                <section className="rm">
                    <button type="button" className="rmBtn">
                        동아리 삭제
                    </button>
                    <button type="button" className="rmBtn">
                        회원 탈퇴
                    </button>
                </section>
            </section>

        </div>
    );
}

function Field({ label, children, noControl = false }) {
    return (
        <div className="field">
            <div className="label">{label}</div>
            {noControl ? children : <div className="control">{children}</div>}
        </div>
    );
}

function AccordionRow({ title, open, onToggle, children }) {
    return (
        <div className="accordionRow">
            <button className="accordionHeader" type="button" onClick={onToggle}>
                <span className="accordionTitle">{title}</span>
                <span className={`chev ${open ? "open" : ""}`} />
            </button>
            {open && <div className="accordionContent">{children}</div>}
            <div className="rowLine" />
        </div>
    );
}
