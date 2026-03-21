import './Club_page.css';
import './Search_modal.css';
import { useState } from "react";

const Club_Page = () =>{
    const [selectModalOpen, setSelectModalOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [tempFilters, setTempFilters] = useState([]);

    const toggleTempFilter = (value) => {
        setTempFilters((prev) =>
            prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        );
    };

    const handleConfirmFilters = () => {
        setSelectedFilters(tempFilters);
        setSelectModalOpen(false);
    };
    return(
        <>
            <div className="layout">
               
                <div className="sidebar">
                    <div className="search-frame">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="검색"
                        />
                        {/* <button class="search-btn" type="button">검색</button>   */}
                    </div>
                    <div className="search-condition-box">
                        {/* 상단 바 */}
                        <div className="search-condition-header" 
                        onClick={() => setSelectModalOpen(true)}
                        >
                            <span>검색 조건</span>
                            <span className="arrow">&gt;</span>
                        </div>

                        {/* 조건 표시 영역 (비어 있음) */}
                        <div className="search-condition-body">
                            {selectedFilters.map((filter) => (
                                <div className="filter-chip" key={filter}>
                                <span>{filter}</span>
                                <button
                                    className="chip-remove"
                                    onClick={() => {
                                        setSelectedFilters(
                                        selectedFilters.filter((f) => f !== filter)
                                        );
                                        setTempFilters((prev) =>
                                            prev.filter((f) => f !== filter)
                                        );
                                        }
                                    }
                                >
                                    ×
                                </button>
                                </div>
                            ))}
                        </div>

                        {/* 하단 안내 텍스트 */}
                        <div className="search-condition-footer">
                            검색초기화 ㅇ
                        </div>
                    </div>
                </div>

                <div className="main">
                    기존 컨텐츠 영역
                </div>
            </div>

            {selectModalOpen && (
                <div
                    className="modal-backdrop"
                >
                    <div
                    className="modal"
                    onClick={(e) => e.stopPropagation()}
                    >
                        <div class="filter-modal">
    
                            <div class="filter-section">
                                <div class="filter-title">지역</div>

                                <div class="filter-options">
                                
                                <label><input type="checkbox" checked={tempFilters.includes("경기")} onChange={() => toggleTempFilter("경기")}/> 경기</label>
                                <label><input type="checkbox" checked={tempFilters.includes("경남")} onChange={() => toggleTempFilter("경남")}/> 경남</label>
                                <label><input type="checkbox" checked={tempFilters.includes("경북")} onChange={() => toggleTempFilter("경북")}/> 경북</label>
                                <label><input type="checkbox" checked={tempFilters.includes("광주")} onChange={() => toggleTempFilter("광주")}/> 광주</label>
                                <label><input type="checkbox" checked={tempFilters.includes("대전")} onChange={() => toggleTempFilter("대전")}/> 대전</label>
                                <label><input type="checkbox" checked={tempFilters.includes("대구")} onChange={() => toggleTempFilter("대구")}/> 대구</label>
                                <label><input type="checkbox" checked={tempFilters.includes("부산")} onChange={() => toggleTempFilter("부산")}/> 부산</label>
                                <label><input type="checkbox" checked={tempFilters.includes("서울")} onChange={() => toggleTempFilter("서울")}/> 서울</label>
                                <label><input type="checkbox" checked={tempFilters.includes("세종")} onChange={() => toggleTempFilter("세종")}/> 세종</label>
                                <label><input type="checkbox" checked={tempFilters.includes("인천")} onChange={() => toggleTempFilter("인천")}/> 인천</label>
                                <label><input type="checkbox" checked={tempFilters.includes("전남")} onChange={() => toggleTempFilter("전남")}/> 전남</label>
                                <label><input type="checkbox" checked={tempFilters.includes("전북")} onChange={() => toggleTempFilter("전북")}/> 전북</label>
                                <label><input type="checkbox" checked={tempFilters.includes("제주")} onChange={() => toggleTempFilter("제주")}/> 제주</label>
                                <label><input type="checkbox" checked={tempFilters.includes("충남")} onChange={() => toggleTempFilter("충남")}/> 충남</label>
                                <label><input type="checkbox" checked={tempFilters.includes("충북")} onChange={() => toggleTempFilter("충북")}/> 충북</label>
                                </div>
                            </div>

                            
                            <div class="filter-section">
                                <div class="filter-title">종목</div>

                                <div class="filter-options">
                                <label><input type="checkbox" checked={tempFilters.includes("축구")} onChange={() => toggleTempFilter("축구")}/> 축구</label>
                                <label><input type="checkbox" checked={tempFilters.includes("미식축구")} onChange={() => toggleTempFilter("미식축구")}/> 미식축구</label>
                                <label><input type="checkbox" checked={tempFilters.includes("탁구")} onChange={() => toggleTempFilter("탁구")}/> 탁구</label>
                                <label><input type="checkbox" checked={tempFilters.includes("농구")} onChange={() => toggleTempFilter("농구")}/> 농구</label>
                                <label><input type="checkbox" checked={tempFilters.includes("티볼")} onChange={() => toggleTempFilter("티볼")}/> 티볼</label>
                                <label><input type="checkbox" checked={tempFilters.includes("유도")} onChange={() => toggleTempFilter("유도")}/> 유도</label>
                                <label><input type="checkbox" checked={tempFilters.includes("주짓수")} onChange={() => toggleTempFilter("주짓수")}/> 주짓수</label>
                                <label><input type="checkbox" checked={tempFilters.includes("야구")} onChange={() => toggleTempFilter("야구")}/> 야구</label>
                                <label><input type="checkbox" checked={tempFilters.includes("풋살")} onChange={() => toggleTempFilter("풋살")}/> 풋살</label>
                                <label><input type="checkbox" checked={tempFilters.includes("검도")} onChange={() => toggleTempFilter("검도")}/> 검도</label>
                                <label><input type="checkbox" checked={tempFilters.includes("배구")} onChange={() => toggleTempFilter("배구")}/> 배구</label>
                                <label><input type="checkbox" checked={tempFilters.includes("테니스")} onChange={() => toggleTempFilter("테니스")}/> 테니스</label>
                                </div>
                            </div>

                            
                            <div class="filter-footer">
                                <button class="confirm-btn"
                                onClick={() => handleConfirmFilters()}
                                >확인</button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default Club_Page;