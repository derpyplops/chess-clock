import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import {ref} from "vue";
import {Stopwatch} from "ts-stopwatch";
import {firebaseConfig, servers} from "./config";
import {Callback, Handler} from "../types/types";

export const useFirebase = () => {
    const app = initializeApp(firebaseConfig);
    const store = getFirestore(app)

    let receiveChannel = null

    let pc = new RTCPeerConnection(servers)

    const parseRawMsg: (msg: string) => [string, string[]] = (msg: string) => {
        const [command, ...args] = msg.split(':')
        return [command, args]
    }

    const makeHandler = (pairs: Callback[]) => { // todo think of a better name
        return (event: MessageEvent) => {
            console.log('recieved over channel', event)
            pairs.forEach(pair => {
                const [command, callback] = pair
                const [msgCommand, args] = parseRawMsg(event.data)
                if (msgCommand === command) callback(args)
            })
        }
    }

    const setHandler: (callbacks: Callback[]) => void = (pairs: [string, (args: string[]) => void][]) => {
        pc.ondatachannel = receiveChannelCallback(makeHandler(pairs));
    }

    const receiveChannelCallback = (handleReceive: Handler) => (event: RTCDataChannelEvent) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = event => handleReceive(event)
        receiveChannel.onopen = ()=>console.log('recieved open', event);
        receiveChannel.onclose = ()=>console.log('recieved closed', event);
    }

    let sendChannel = pc.createDataChannel('sendChannel')

    sendChannel.onopen = () => {
        console.log('Connected!')
    }

    const makeCall = async () => {
        console.log('calling...')
        const callCollection = collection(store,'calls')
        const callDoc = await addDoc(callCollection, {hello: "hello"})
        const offers = collection(store, 'calls', callDoc.id, 'offers')
        const answers = collection(store, 'calls',  callDoc.id, 'answers')

        pc.onicecandidate = pc.onicecandidate = (event) => {
            console.log('ice candidate rcvd', event)
            event.candidate && addDoc(offers, event.candidate.toJSON())
        };

        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        await setDoc(callDoc, {offer})

        // Listen for remote answer
        onSnapshot(callDoc, (snapshot) => { // friend has answered

            const data = snapshot.data()
            console.log('answered!', data)
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer)
                pc.setRemoteDescription(answerDescription)
            }
        })

        // listen to icecandidate added
        onSnapshot(answers, (snapshot) => {
            console.log('added!', snapshot.docChanges())
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data())
                    pc.addIceCandidate(candidate)
                }
            })
        })

        return callDoc.id
    }

    const makeAnswer = async (callId: string) => {
        console.log('answering...')
        const callDoc = doc(store, 'calls', callId)
        const offers = collection(store, 'calls', callDoc.id, 'offers')
        const answers = collection(store, 'calls',  callDoc.id, 'answers')

        pc.onicecandidate = event => {
            console.log('ice candidate rcvd', event)
            event.candidate && addDoc(answers, event.candidate.toJSON())

        }

        const callData = (await getDoc(callDoc)).data()
        console.log('received', callData)
        const offerDescription = callData?.offer
        await pc.setRemoteDescription(offerDescription)

        const answerDescription = await pc.createAnswer()
        await pc.setLocalDescription(answerDescription)

        const answer = {
            sdp: answerDescription.sdp,
            type: answerDescription.type,
        };

        await updateDoc(callDoc, {answer})

        onSnapshot(offers, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    let data = change.doc.data()
                    pc.addIceCandidate(new RTCIceCandidate(data))
                }
            })
        })
    }

    const send = (msg: string) => sendChannel.send(msg)

    return {
        makeCall,
        makeAnswer,
        send,
        setHandler
    }

}