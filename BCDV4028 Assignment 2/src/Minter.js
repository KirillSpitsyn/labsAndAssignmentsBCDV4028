import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./util/interact.js";
import DisplayNFT from "./displayNFT.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [nfts, setNFTs] = useState([])
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  const [isLoading, setIsLoading] = useState(true); 

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    fetchNFTs().then(data => {
      setNFTs(data.tokens)
      console.log(data)
    })

    addWalletListener();

    onMintPressed().then(() => {
      setTimeout(() => { 
        setIsLoading(false); 
      }, 50000); 
    }).then(fetchNFTs().then(data => {
      setNFTs(data.tokens)
      console.log(data)
    }))
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          {" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://solitary-practical-glitter.ethereum-sepolia.quiknode.pro/a265d1e74d56c8c68808f0bb27682d5fb9eb9e31/");
    const nfts = await provider.send("qn_fetchNFTsByCollection", {
      nft: walletAddress,
      page: 1,
      perPage: 10})
    return nfts
  }

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(url, name, description);
    
    setStatus(status);
    if (success) {
      setName("");
      setDescription("");
      setURL("");
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title"> NFT Marketplace</h1>
      <p>
        Add your asset's Pinata link, name, and description, and then press "Mint."
      </p>
      <form>
        <h2>Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>Name of asset: </h2>
        <input
          type="text"
          placeholder="Enter the name of the asset"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>Description of asset: </h2>
        <input
          type="text"
          placeholder="Enter the description of the asset"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
        <h3>NFT's on this account:</h3>
        <DisplayNFT></DisplayNFT>
        {!isLoading &&
        <>
        <h3>Your "{nfts[nfts.length()-1].name}" NFT that was just minted:</h3>
        {nfts[nfts.length()-1].imageUrl}
        </>
        }
    </div>
  );
};

export default Minter;
