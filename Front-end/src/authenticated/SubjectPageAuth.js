import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./SubjectPage.module.css";
const SubjectPage = () => {
  const params = useParams();
  const [fileName, setFileName] = useState("");
  const [fileLink, setLink] = useState("");
  const [fileData, setFileData] = useState([]);

  const subject = params.subject;
  const isFormValid = fileName.length !== 0 && fileLink.length !== 0;
  useEffect(() => {
    fetchData();
  }, [fileData]);
  const fetchData = () => {
    fetch("http://localhost:8080/api/data")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data
          .filter((item) => item.subject === subject)
          .map((item) => [item.name, item.link]);

        setFileData(filteredData);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  };

  const addDataHandler = (event) => {
    event.preventDefault();
    let databody = {
      name: fileName,
      link: fileLink,
    };
    setFileName("");
    setLink("");

    fetch(`http://localhost:8080/api/${subject}/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(databody),
    }).catch((error) => {
      console.log("error occured");
    });
  };
  const deleteHandler = (name, link) => {
    const databody = {
      name: name,
      link: link,
    };

    fetch(`http://localhost:8080/api/${subject}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(databody),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Data deleted successfully");
          const updatedFileData = fileData.filter(
            (item) => item[0] !== name && item[1] !== link
          );
          setFileData(updatedFileData);
        } else {
          console.log("Failed to delete data");
        }
      })
      .catch((error) => {
        console.log("Error occurred while deleting data:", error);
      });
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.subjectCard}>
          <h2>Upload:</h2>
          <div className={styles.inputContainer}>
            <input
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              type="text"
              className={styles.inputField}
              placeholder="Enter Name"
            />
            <input
              value={fileLink}
              onChange={(event) => setLink(event.target.value)}
              type="text"
              className={styles.inputField}
              placeholder="Enter Google Drive Link"
            />
            <button
              onClick={addDataHandler}
              className={styles.submitButton}
              disabled={!isFormValid}
            >
              +
            </button>
          </div>
        </div>
        {fileData.map((item) => (
          <div className={styles.subjectCard}>
            {" "}
            {item[0]}
            <a href={item[1]} download>
              <button className={styles.loginButton}> Download </button>
            </a>
            <button
              onClick={() => {
                deleteHandler(item[0], item[1]);
              }}
              className={styles.deleteButton}
            >
              {" "}
              X
            </button>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default SubjectPage;
