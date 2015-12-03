#### Normal placement
* Given []
* When [Place(0,0,X)]
* Then [Placed(0,0,X)]

#### Player won
* Given [Placed(0,0,X), Placed(1,1,O), Placed(0,1,X), Placed(2,2,O)]
* When [Place(0,2,X)]
* Then [Placed(0,2,X), PlayerXWins]

#### Placed out of bounds
* Given []
* When [Place(0,3,X)]
* Then [IllegalMove]

#### Placed on top of another symbol
* Given [Placed(0,0,X)]
* When [Place(0,0,O)]
* Then [IllegalMove]

#### Not players turn
* Given [Placed(0,0,X)]
* When [Place(0,1,X)]
* Then [IllegalMove]

#### Player wins horizontally
* Given [Placed(0,0,X), Placed(0,1,O), Placed(1,0,X), Placed(0,2,O)]
* When [Place(2,0,X)]
* Then [Placed(2,0,X), PlayerXWins]

#### Player wins vertically
* Given [Placed(0,0,X), Placed(1,0,O), Placed(0,1,X), Placed(2,0,O)]
* When [Place(0,2,X)]
* Then [Placed(0,2,X), PlayerXWins]

#### Player wins diagonally
* Given [Placed(0,0,X), Placed(0,1,O), Placed(1,1,X), Placed(0,2,O)]
* When [Placed(2,2,X)]
* Then [Placed(2,2,X), PlayerXWins]

#### Draw
* Given [Placed(1,1,X), Placed(0,1,O), Placed(2,0,X), Placed(0,2,O), Placed(0,0,X), Placed(2,2,O), Placed(1,2,X), Placed(1,0,O)]
* When [Place(2,1,X)]
* Then [Placed(2,1,X), Draw]
