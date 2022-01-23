import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getFirestore, collection, addDoc, setDoc, getDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import {ref} from "vue";
import {Stopwatch} from "ts-stopwatch";
import {firebaseConfig, servers} from "./config";


export const useFirebase = (sw: Stopwatch) => {

    const callId = ref('')

    const app = initializeApp(firebaseConfig);
    const store = getFirestore(app)

    let receiveChannel = null

    let pc = new RTCPeerConnection(servers)

    const receiveChannelCallback = (event: RTCDataChannelEvent) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = event => handleReceive(event)
        receiveChannel.onopen = ()=>console.log('recieved open', event);
        receiveChannel.onclose = ()=>console.log('recieved closed', event);
    }

    const handleReceive = (event: MessageEvent) => {
        console.log('recieved over channel', event)
        if (event.data === 'start') {
            sw.start()
        } else if (event.data === 'stop') {
            sw.stop()
        }
    }
    pc.ondatachannel = receiveChannelCallback;

    let sendChannel = pc.createDataChannel('sendChannel')

    sendChannel.onopen = () => {
        console.log('Connected!')
    }

    const startOther = () => {
        sendChannel.send('start')
    } // takes function that starts

    const stopOther = () => {
        sendChannel.send('stop')
    } // takes function that starts

    const makeCall = async () => {
        console.log('calling...')
        const callCollection = collection(store,'calls')
        const callDoc = await addDoc(callCollection, {hello: "hello"})
        const offers = collection(store, 'calls', callDoc.id, 'offers')
        const answers = collection(store, 'calls',  callDoc.id, 'answers')

        callId.value = callDoc.id

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

    }

    const makeAnswer = async () => {
        console.log('answering...')
        const id = callId.value
        const callDoc = doc(store, 'calls', id)
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


    return {
        makeCall,
        makeAnswer,
        callId,
        startOther,
        stopOther
    }

}