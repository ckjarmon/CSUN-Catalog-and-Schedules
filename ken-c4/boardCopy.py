BOARD_COLS = 7
BOARD_ROWS = 6

# creates copy of the board to manipulate
class boardCopy():

    global boardCopy
    global lastMove
    
    

    def __init__(self, Board, R, C):
        boardCopy = Board
        print(boardCopy)

        leftUP = [[R-3, C-3], [R-2, C-2], [R-1, C-1], [R, C]]
        # Bad spot for AI would be R-2, C-3
        leftDOWN = [[R+2, C-2], [R+1, C-1], [R, C], [R-1, C+1]]
        # Bad spot for AI would be R, C+1
        
        rightUP = [[R, C], [R-1, C+1], [R-2, C+2], [R-3, C+3]]
        # Bad spot for AI would be R-2, C+3
        rightDOWN = [[R-1, C-1], [R, C], [R+1, C+1], [R+2, C+2]]
        # 
        
        # If leftUP[0] leftUP[1] or leftUP[2] results in a spot outside the board, move on
        # Same for leftDOWN
        
        # If rightUP[1] rightUP[2] or rightUP[3] results in a spot outside the board, move on
        # Same for rightDOWN
        
        