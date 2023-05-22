import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { log } from 'next/dist/server/typescript/utils';

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [result, setResult] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    setButtonClicked(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  console.log(result)
  return (
    <div>
      <Head>
        <title>Гороскопер</title>
      </Head>

      <main className={styles.main}>
        <h3>Гороскопер</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Введите имя"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Покажи гороскоп на июнь" />
        </form>

        {buttonClicked && result === null && <div className={styles.result}>Загрузка...</div>}

        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
