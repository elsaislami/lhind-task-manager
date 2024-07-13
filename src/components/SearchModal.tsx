import React, { useState, useEffect, useRef } from "react";
import styles from "./SearchModal.module.css";
import { useTranslation } from "react-i18next";

const SearchModal: React.FC<{
  setShowModal: (show: boolean) => void;
}> = ({ setShowModal }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    console.log("Search value:", search);
  }, [search]);

  return (
    <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
      <div className={styles.modalContent} ref={modalRef}>
        <h2>{"Search for user or task"}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.inputField}
        />
      </div>
    </div>
  );
};

export default SearchModal;
