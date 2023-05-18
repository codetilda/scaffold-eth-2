import type { NextPage } from "next";
import { FormEventHandler, useState } from "react";
import Head from "next/head";
import Image from "next/image";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Prediction = {
    id: string;
    status: string;
    output: string[];
    detail: string;
};

const NftMinter: NextPage = () => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
  
    const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: e.target.prompt.value,
        }),
      });
      let prediction = await response.json();
      if (response.status !== 201) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const response = await fetch("/api/predictions/" + prediction.id);
        prediction = await response.json();
        if (response.status !== 200) {
          setError(prediction.detail);
          return;
        }
        console.log({prediction})
        setPrediction(prediction);
      }
  };

  return (
    <>
      <Head>
        <title>Mint AI NFT Example UI</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2 and Replicate" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <div className="container mx-auto p-8 text-xl max-w-2xl">
        <form className="flex mb-8" onSubmit={handleSubmit}>
          <input className="w-full p-4 rounded text-xl mr-4 border-2" type="text" name="prompt" placeholder="Enter a prompt to display an image" />
          <button className="p-4 rounded border-2 cursor-pointer text-xl" type="submit">Generate!</button>
        </form>

        {error && <div>{error}</div>}

        {prediction && (
            <div>
                {prediction.output && (
                <div className="flex flex-wrap justify-center">
                <Image
                    src={prediction.output[prediction.output.length - 1]}
                    alt="AI Generated NFT"
                    height={256}
                    width={256}
                />
                </div>
                )}
                <p>status: {prediction.status}</p>
            </div>
          )}
      </div>
    </>
  );
};

export default NftMinter;