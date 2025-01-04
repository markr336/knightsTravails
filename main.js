/*
Knight movement:
- 2 steps forward & 1 step to a side
- 1 step forward & 2 steps to a side
- can be done in any direction

Chessboard is represend as a graph:
- Each square is a vertex
- Knights move is represented by the edges between nodes
- Goal is to traves the graph to find shortest route between 2 vertices

- x & y are between 0 & 7
- edges asre the valid knigt moves between vertices:
    from [0, 0], a knight can move to [2, 1] or [1, 2]
    each of these moves represents a connection between the vertex [0, 0] &
    other reachable vertices

Don't need to explicity create a graph object with vertices & edges. Instead
the graph is implicit, where the knight starts on a specific vertex, and the alogrithm
will dynamically explore all possible moves (edges) to other vertices (positions on the board)
as it traverses

example:
knightMoves([0,0],[3,3]) == [[0,0],[2,1],[3,3]] or knightMoves([0,0],[3,3]) == [[0,0],[1,2],[3,3]]
knightMoves([3,3],[0,0]) == [[3,3],[2,1],[0,0]] or knightMoves([3,3],[0,0]) == [[3,3],[1,2],[0,0]]
knightMoves([0,0],[7,7]) == [[0,0],[2,1],[4,2],[6,3],[4,4],[6,5],[7,7]] or knightMoves([0,0],[7,7]) == [[0,0],[2,1],[4,2],[6,3],[7,5],[5,6],[7,7]]

*/

class Graph {
    constructor(size) {
        this.adjacentMatrix = Array.from({length: size}, () => Array(size).fill(0))
        this.size = size
        this.vertexData = Array(size).fill('')
    }

    addEdge(u, v) {
        if (0 <= u && u < this.size && 0 <= v && v < this.size) {
            this.adjacentMatrix[u][v] = 1
            this.adjacentMatrix[v][u] = 1
        }
    }

    addVertexData(vertex, data) {
        if (0 <= vertex && vertex < this.size) {
            this.vertexData[vertex] = data
        }
    }

    printGraphs() {
        console.log('Adjacency Matrix:')
        for (const row of this.adjacentMatrix) {
            console.log(row.join(' '))
        }

        console.log('\nVertex Data:')
        for (let i = 0; i < this.size; i++) {
            console.log(`Vertex ${i}: ${this.vertexData[i]}`)
        }
    }

    bfs(startingVertex) {
        console.log(startingVertex)
        console.log(this.vertexData[0])
        // indexOf doesn't work when using an array as a search reference
        // so need to use findIndex()
        const startingIndex = this.vertexData.findIndex(subArray => 
            JSON.stringify(subArray) == JSON.stringify(startingVertex)
        )
        const queue = [startingIndex]
        console.log(queue)

        const visited = Array(this.size).fill(false);
        console.log(visited)
        visited[queue[0]] = true;
    
        while (queue.length > 0) {
          const current_vertex = queue.shift(); // Removes element from front of the queue
          console.log(this.vertexData[current_vertex]);
    
          for (let i = 0; i < this.size; i++) {
            if (this.adjacentMatrix[current_vertex][i] === 1 && !visited[i]) {
              queue.push(i);
              visited[i] = true;
            }
          }
        }

        console.log(visited)
    }

    knightMoves(startingVertex, endingVertex) {
        // Get index of startingVertex - indexOf doesn't work for searching arrrays
        const startingIndex = this.vertexData.findIndex(subArray => 
            JSON.stringify(subArray) == JSON.stringify(startingVertex)
        )
        const queue = [startingIndex]

        // Keep track of vertices that had been previously visited
        const visited = Array(this.size).fill(false)
        visited[queue[0]] = true

        // Path costs are infinity for all vertices as they're unknown
        const pathCost = Array(this.size).fill(Infinity)
        pathCost[queue[0]] = 0

        // Previous vertex visited is stored which is used later to find shortest path
        const previousVertex = Array(this.size).fill(null)

        // BFS looks at all nodes that are one path away from the starting vertex,
        // then all nodes that are two pathes away (nodes after the starting vertex),
        // then 3 & so fourth
        while(queue.length > 0) {
            const currentVertex = queue.shift()

            for (let i = 0; i < this.size; i++) {
                if (this.adjacentMatrix[currentVertex][i] == 1 && !visited[i]) {
                    queue.push(i)
                    visited[i] = true
                    previousVertex[i] = currentVertex
                    pathCost[i] = pathCost[currentVertex] + 1
                }
            }
        }

        // Find the index of the end vertes in the vertexData array
        const endingIndex = this.vertexData.findIndex(subArray => 
            JSON.stringify(subArray) == JSON.stringify(endingVertex)
        )

        // Path is reconstructed by working backwards from the endingVertex to
        // the startingVertex. It uses the previousVertex array to work back.
        let path = []
        let current = endingIndex
        while (current != null) {
            path.unshift(this.vertexData[current])
            current = previousVertex[current]
        }

        console.log(`You've made it in ${pathCost[endingIndex]} moves`)
        console.log(`Here's your path:`)
        for (const square of path) {
            console.log(square)
        }
    }
}

const knight = new Graph(64)

// Create chess board
function createChessboard() {
    let index = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            knight.addVertexData(index, [i, j])
            index++
        }
    }
}

// Create edges for knight moves: 2 vertical 1 horizontal or 1 vertical 2 horizontal
// The below shows how the knight moves up between indices on the board (i.e. 0,0[0] to 2,1[10])
// 2up + 1right = 17
// 2up + 1left = 15
// 1up + 2right = 10
// 1up + 2left = 6
// As it's an undirected graph, no need to work out the down moves
function edgesForKnight() {
    for (let i = 0; i < 64; i++) {
        if (i == 0 || i == 8 || i == 16 || i == 24 || i == 32 || i == 40 || i == 48 || i == 56) {
            knight.addEdge(i, i + 10)
            knight.addEdge(i, i + 17)
        }
        else if (i == 1 || i == 9 || i == 17 || i == 25 || i == 33 || i == 41 || i == 49 || i == 57) {
            knight.addEdge(i, i + 10)
            knight.addEdge(i, i + 17)
            knight.addEdge(i, i + 15)
        }
        else if (i == 6 || i == 14 || i == 22 || i == 30 || i == 38 || i == 46 || i == 54 || i == 62) {
            knight.addEdge(i, i + 17)
            knight.addEdge(i, i + 15)
            knight.addEdge(i, i + 6)
        }
        else if (i == 7 || i == 15 || i == 23 || i == 31 || i == 39 || i == 47 || i == 55 || i == 63) {
            knight.addEdge(i, i + 15)
            knight.addEdge(i, i + 6)
        }
        else {
            knight.addEdge(i, i + 10)
            knight.addEdge(i, i + 17)
            knight.addEdge(i, i + 15)
            knight.addEdge(i, i + 6)
        }
    }
}

createChessboard()
edgesForKnight()
// knight.printGraphs()
// knight.bfs([0, 0])

knight.knightMoves([0, 0], [5, 4])