import React from "react"
import { useState } from 'react'
import Web3 from 'web3'
import Web3Modal from "web3modal"
import { getImg } from "../../hook/Helper"
import styles from './Home.module.sass'
import BigNumber from "bignumber.js"
import axios from 'axios'
import CrocosNFTAbi from '../../ABI/CrocosNFT.json'
import WalletConnectProvider from "@walletconnect/web3-provider"
const CrocosNFTAddr = '0x18b73D1f9e2d97057deC3f8D6ea9e30FCADB54D7'

export const CardNum = () => {
    const [mine, setMine] = useState(-1);
    const [nft, setNFT] = useState([]);
    const total = 10000;
    const handleClick = async () => {
        const providerOptions = {
            injected: {
                package: null
            },
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: "8b912ed1abb240778b91697adee55c0d"
                }
            }
        };
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
            providerOptions
        });
        const provider = await web3Modal.connect();
        provider.on("accountsChanged", (accounts) => {
            if(accounts === [])
                setMine(-1)
        })
        const web3 = new Web3(provider);
        const account = await web3.eth.getAccounts()

        const NFT = new web3.eth.Contract(CrocosNFTAbi, CrocosNFTAddr)
        const myNFT = []
        const minted = await NFT.methods.totalSupply().call()
        const myCnt = await NFT.methods.balanceOf(account[0]).call()
        for(let i = 0; i < myCnt; i ++) {
            const index = await NFT.methods.tokenOfOwnerByIndex(account[0], i).call()
            console.log(index)
            let url = await NFT.methods.tokenURI(index).call()
            url = url.replace("ipfs://", "ipfs/")
            console.log(`https://ipfs.io/${url}`)
            const res = await axios.get(`https://ipfs.io/${url}`)
            const nft = {
                name: res.data.edition,
                image: res.data.image,
                attributes: res.data.attributes
            }
            myNFT.push(nft)
        }
        setNFT(myNFT)
        setMine(minted)
    }

    const filterUrl = (url) => {
        const temp = url.replace("ipfs://", "ipfs/")
        return `https://ipfs.io/${temp}`
    }

    return (
        <div>
            <div style={{ fontSize: '3rem', color: '#000' }}>
                Made with ❤️ by oropunks.art<br />
                {mine === -1 ?
                    <button onClick={handleClick} style={{ fontSize: '2rem', padding: '1rem 2rem', background: 'transparent', border: '0.3rem solid #000', marginTop: '1rem', cursor: 'pointer' }}>
                        Connect Wallet
                    </button> : <>
                        Minted: {mine} / {total} ({mine * 100 / total}%)<br />
                        My Crocos Collection
                    </>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                {mine !== -1 && nft.map((item, index) => (
                    <div key={index} className={styles.card}>
                        <div style={{height:574}}>
                            <img src={filterUrl(item.image)} style={{width:376, height:574}} alt="nft" />
                        </div>
                        <div style={{borderTop:'0.5rem solid #000'}}>
                            <div style={{ fontSize: 30, marginBottom:30, marginLeft: 10, textAlign:'left', fontWeight: 700 }}>#{item.name}</div>
                            <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>
                                {item.attributes.map((attribute, ind) => (
                                    <div key={ind} style={{backgroundColor:'#1b1c1d', color:'white', fontWeight: 600, fontSize: 14, borderRadius: 5, padding: 4, display:'flex', margin:4, minWidth:'auto'}}>
                                        {`${attribute.trait_type} ${attribute.value}`}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>)
                )}
            </div>
        </div>
    )
}