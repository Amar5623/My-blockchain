#server\node.py
import datetime
import hashlib
import json
from urllib.parse import urlparse
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from uuid import uuid4
import sys

class Blockchain:
    def __init__(self):
        self.chain =[]
        self.transactions=[]
        self.create_block(proof=1, previous_hash='0')
        self.nodes = set()

    def create_block(self,proof,previous_hash):
        block = {
            "index": len(self.chain)+1,
            "timestamp": str(datetime.datetime.now()),
            "previous_hash": previous_hash,
            "transactions": self.transactions,
            "proof": proof,
        }
        hash = self.hash(block)
        block["hash"] = hash
        self.transactions = []
        self.chain.append(block)
        return block
    
    def get_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:5] == '00000' :
                check_proof = True
            else:
                new_proof += 1
        return new_proof
    
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys = True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
        
    def is_chain_valid(self,chain):
        previous_block = chain[0]
        block_index = 1
        while block_index<len(chain):
            block = chain[block_index]
            if block["previous_hash"] != self.hash(previous_block):
                return False
            previous_proof = previous_block["proof"]
            proof = block["proof"]
            hash_operation = hashlib.sha256(str(proof*2 - previous_proof*2).encode()).hexdigest()
            if hash_operation[:4] != '00000':
                return False
            previous_block = block
            block_index +=1
        return True
    
    def add_transaction(self, sender, receiver, amount):
        self.transactions.append({
            "sender": sender,
            "receiver": receiver,
            "amount": amount
        })
        previous_block = self.get_previous_block()
        return previous_block["index"]+1
    
    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)


    def replace_chain(self):
        '''
        Fuction logic workflow:
            1.) Get all the nodes in the network
            2.) Initialize the variable to tracck the longest chain down
            3.) Request the blockchain from each node and if the response is valid then extract the blockchain and it's length.
            4.) Compare the received blockchain's length with current chain length and if it's longer and valid replace the local blockchain with the new current chain.
            5.) if the chain was replaced return true otherwise return false.
        '''
        network = self.nodes
        Longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length
                    Longest_chain = chain
        if Longest_chain:
            self.chain = Longest_chain
            return True
        return False

app =Flask(__name__)

CORS(app)

node_address = str(uuid4()).replace("-",'')

blockchain = Blockchain()

@app.route('/mine_block', methods = ['GET'])

def mine_block():
    previous_block  = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    previous_hash = previous_block["hash"]
    proof = blockchain.proof_of_work(previous_proof)
    block = blockchain.create_block(proof, previous_hash)
    response = {
        "message": "Congratulations, you have mined a block!",
        "index": block["index"],
        "timestamp": block["timestamp"],
        "proof": block["proof"],
        "previous_hash": block["previous_hash"],
        "transactions": block["transactions"],
    }

    return jsonify(response), 200

@app.route("/get_chain", methods=["GET"])
def get_chain():
    response = {
        "chain": blockchain.chain,
        "active_nodes": list(blockchain.nodes),
        "length": len(blockchain.chain),
    }
    return jsonify(response), 200

@app.route("/is_valid", methods=["GET"])
def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {"message": "The blockchain is valid."}
    else:
        response = {"message": "The blockchain is not valid."}
    return jsonify(response), 200
        
@app.route('/add_transaction', methods = ['POST'])
def add_transactions():
    json = request.json
    transaction_keys = ["sender", "receiver", "amount"]

    if not all(key in json for key in transaction_keys):
        return "Some elements of the transaction are missing", 400
    
    index = blockchain.add_transaction(json["sender"], json["receiver"], json["amount"])
    response = {
        "message": f"This transaction will be added to Block {index}"
    }

    return jsonify(response), 201

@app.route('/connect_node', methods=['POST'])
def connect_node():
    json = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return "No Node", 400
    for node in nodes:
        print(node)
        blockchain.add_node(node)
    response = {
        "message": "All the nodes are now connected",
        "total_nodes": list(blockchain.nodes)
    }
    return jsonify(response), 201

@app.route('/replace_chain', methods=['GET'])
def replace_chain():
    is_chain_replaced = blockchain.replace_chain()
    if is_chain_replaced:
        response = {
            "message": "The nodes had different chains so the chain was replaced by the longest chain.",
            "new_chain": blockchain.chain
        }
    else:
        response = {
            "message": "All good. The chain is largest one.",
            "actual_chain": blockchain.chain,
        }
    return jsonify(response), 200

if __name__ == '__main__':
    port = 5000
    if len(sys.argv) > 1:
        port = int(sys.argv[1]) 
    app.run(host='0.0.0.0', port=port)