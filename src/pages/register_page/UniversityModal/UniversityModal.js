import { useEffect, useState } from "react";
import "./UniversityModal.css";
import closeIcon from "../../../assets/close.svg";

const UniversityModal = ({ onClose, onSelect }) => {
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const urls = [
          "https://672818aa270bd0b975544f4d.mockapi.io/api/v1/univ1",
          "https://672818aa270bd0b975544f4d.mockapi.io/api/v1/univ2",
          "https://6999bfdc9a9ce1d259f29949.mockapi.io/univ3",
          "https://6999bfdc9a9ce1d259f29949.mockapi.io/univ4",
        ];

        const responses = await Promise.all(
          urls.map((url) => fetch(url))
        );

        const dataArrays = await Promise.all(
          responses.map((res) => res.json())
        );

        const merged = dataArrays.flat();

        merged.sort((a, b) => a.name.localeCompare(b.name, "ko"));

        setUniversities(merged);
        setFiltered(merged);
        setLoading(false);
      } catch (err) {
        console.error("대학 불러오기 실패:", err);
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(universities);
      return;
    }

    const result = universities.filter((univ) =>
      univ.name.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);
  }, [search, universities]);

  const handleSelect = (name) => {
    onSelect(name);
    onClose();
  };

  return (
    <div className="univ-modal-backdrop">

      <div className="univ-modal">
        <img
          src={closeIcon}
          alt="close"
          className="univ-modal-close"
          onClick={onClose}
        />

        <div className="univ-modal-header">
          <span>대학교 선택</span>
        </div>

        <input
          className="univ-search"
          placeholder="대학교 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="univ-list">

          {loading && <div className="univ-loading">불러오는 중...</div>}

          {!loading && filtered.length === 0 && (
            <div className="univ-empty">검색 결과 없음</div>
          )}

          {!loading &&
            filtered.map((univ) => (
              <div key={univ.id} className="univ-item">

                <span className="univ-name">
                  {univ.name}
                </span>

                <button
                  className="univ-select-btn"
                  onClick={() => handleSelect(univ.name)}
                >
                  선택
                </button>

              </div>
            ))}

        </div>

      </div>

    </div>
  );
};

export default UniversityModal;