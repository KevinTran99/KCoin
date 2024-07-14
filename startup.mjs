import Blockchain from './models/Blockchain.mjs';
import PubNubServer from './pubnubServer.mjs';

const credentials = {
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  secretKey: process.env.SECRET_KEY,
  userId: process.env.USER_ID,
};

export const blockchain = new Blockchain();
export const pubnubServer = new PubNubServer({ blockchain, credentials });
