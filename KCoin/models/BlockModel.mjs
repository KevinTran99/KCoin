import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  blockIndex: { type: Number, required: true, unique: true },
  lastBlockHash: { type: String, required: true },
  currentBlockHash: { type: String, required: true },
  data: { type: Array, required: true },
  nonce: { type: Number, required: true },
  difficulty: { type: Number, required: true },
});

export default mongoose.model('Block', blockSchema);
