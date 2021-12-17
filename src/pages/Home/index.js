import React from "react";
import { getImg } from "../../hook/Helper";
import styles from './Home.module.sass';
import { CardNum } from './CardNum'

export const Home = () => {

	return (
		<div className={styles.div} style={{ backgroundImage: `url(${getImg('home/bg.png')})`, backgroundSize: '100% 100%', minHeight:'100vh', height:'auto', width:'100%' }}>
			<CardNum />
		</div>
	)
}