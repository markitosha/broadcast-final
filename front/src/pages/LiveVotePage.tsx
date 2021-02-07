import React from 'react';
import {Frame} from "../components/Frame";
import {Vote} from "../components/Vote";
import styles from './Live.module.css';
// @ts-ignore
import {getBasepath} from "hookrouter";

const LiveVotePage: React.FC = () => {
    const showFrame = !getBasepath().includes('controller');

    return (
        <div className={styles.VoteContainer}>
            {showFrame && <Frame />}
            <Vote />
        </div>
    );
}

export { LiveVotePage };