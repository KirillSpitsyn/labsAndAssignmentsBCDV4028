import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import NFT from './NFT';

function DisplayNFT() {
  const [nfts, setNFTs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [address, setAddress] = useState('0x7a070Da3956cbA5D1B428D916735681F92Fac813')

  //function to fetch nfts by collection
  const fetchCollection = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://solitary-practical-glitter.ethereum-sepolia.quiknode.pro/a265d1e74d56c8c68808f0bb27682d5fb9eb9e31/");
    const collection = await provider.send("qn_fetchNFTsByCollection", {
      collection: address,
      page: 1,
      perPage: 10})
    return collection
  }

  useEffect(() => {
    fetchCollection()
    .then(data => {
      setNFTs(data.tokens)
      setIsLoading(false)
      console.log(data)
    })
    .catch(err => setNFTs([]))
  }, [address]);

  
  //jsx containing my rendering
  return (
    <div>
        {nfts.map(token => <NFT key={token.name} nft={token} />)}
    </div>
  );
}

export default DisplayNFT;