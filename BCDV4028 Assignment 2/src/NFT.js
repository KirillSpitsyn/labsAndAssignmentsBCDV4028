import React from 'react';

//component that maps nfts
const NFT = ({nft}) => {
    return (
        <div>
            <img src={nft.imageUrl} alt="NFT picture" width={300} height={300}/>
            <br></br>
        </div>
    )
}

export default NFT;