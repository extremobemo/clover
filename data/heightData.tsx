// photoHeightData.js
// You can think of these values as prioroty. 
// assets using a LARGER number will occupy more space 
// at the expense of other assets. 

const photoHeightData = {
  allPhotosHeightData: [
    [
      // Group 1
      [2, 0, 2, 4, 3],   // Column 1
      [3, 4, 0, 4, 3],    // Column 2
    ],
    [
      // Group 2
      [12, 0, 12, 0, 0],   // Column 1
      [0, 10, 10, 0, 0],     // Column 2
    ],
    [
      // Group 3
      [0, 10, 20, 0, 0],    // Column 1
      [20, 0, 22, 0, 0],    // Column 2
    ],
    [
      // Group 4
      [0, 40, 0, 6, 0],    // Column 1
      [0, 0, 1, 6, 0],     // Column 2
    ],
    [
      // Group 5
      [15, 0, 0, 15, 6],     // Column 1
      [5, 10, 18, 20, 12],    // Column 2
    ],
    [
      // Group 6
      [6, 8, 9, 5, 9],     // Column 1
      [7, 6, 9, 10, 6],    // Column 2
    ],

    // Group 7
    [
      [6, 8, 9, 5, 9],     // Column 1
      [0, 15, 9, 15, 0],    // Column 2
    ],
    // Group 8
    [
      [0, 0, 0, 0, 0],     // Column 1
      [3, 6, 4, 8, 0],    // Column 2
    ]
  ],
  productionPhotosHeightData: [
    [
      // Group 1
      [1, 25, 5, 5, 5],   // Column 1
      [0, 20, 5, 5, 5],    // Column 2
    ],
    [
      // Group 2
      [2, 20, 10, 5, 5],   // Column 1
      [0, 1, 25, 5, 5],    // Column 2
    ],
    [
      // Group 3
      [15, 5, 5, 5, 5],   // Column 1
      [35, 2, 5, 5, 5],    // Column 2
    ],
    [
      // Group 4
      [5, 5, 5, 5, 5],   // Column 1
      [5, 5, 5, 5, 5],    // Column 2
    ],
    [
      // Group 5
      [5, 5, 5, 5, 5],   // Column 1
      [5, 5, 5, 5, 5],    // Column 2
    ],
  ],

  videoPhotosHeightData: [
    [
      // Group 1
      [2, 20],   // Column 1
      [12, 1 ],    // Column 2
    ],
    [
      // Group 2
      [2, 30],   // Column 1
      [10, 2],    // Column 2
    ],
    [
      // Group 3
      [1, 20, 5, 5, 5],   // Column 1
      [1, 25, 5, 5, 5],    // Column 2
    ],
    [
      // Group 4
      [5, 5, 5, 5, 5],   // Column 1
      [5, 5, 5, 5, 5],    // Column 2
    ],
  ]
};

export default photoHeightData;
