---
title: ReversiEight - A Windows 8 Reversi Game
date: 2013-09-01 00:00:00 Z
categories:
- Tech
tags:
- codeproject
author: ceberhardt
layout: default_post
source: codeproject
summary: Describes the development of a Reversi game for Windows 8 using MVVM, covering UI layout across multiple screen states, game logic using delegates and LINQ, and a computer opponent built with the minimax algorithm. The article also covers practical topics such as UI design with GIMP and the Windows 8 app lifecycle.
---

*This article was originally published on CodeProject, which has since shut down.*

- [View the project on github](https://github.com/ColinEberhardt/ReversiEight) ( contains GIMP graphics as well as source code)

![ReversiEight]({{ site.baseurl }}/ceberhardt/assets/codeproject/ReversiEight.png)

## Introduction

It’s been a while since I last dabbled with Windows 8, so I thought I’d have a go at creating a simple game app - and in this article, I’ve shared what I came up with. This article describes the MVVM structure of the game, but also covers a real mixed bag of topics including:

- How to efficiently handle the various layout requirements of a Windows 8 app.
- Designing the UI using GIMP.
- Using delegates and a bit of Linq in order to simplify the game logic
- Creating a computer opponent using the minimax algorithm.

## The Basic View Model Structure

The Reversi game is ‘backed’ by the `GameBoardViewModel` which exposes the game state via a set of properties such as the current score, the player whose turn it is next, and the state of the board itself as a collection of `GameBoardSquareViewModel` instances:

```csharp
public class GameBoardViewModel : ViewModelBase
{

  public GameBoardViewModel()
  {
    _squares = new List<GameBoardSquareViewModel>();
    for (int col = 0; col < 8; col++)
    {
      for (int row = 0; row < 8; row++)
      {
        _squares.Add(new GameBoardSquareViewModel(row, col, this));
      }
    }

    InitialiseGame();
  }

  public int BlackScore
  {
    get { return _blackScore; }
    private set
    {
      SetField<int>(ref _blackScore, value, "BlackScore");
    }
  }

  public int WhiteScore
  {
    get { return _whiteScore; }
    private set
    {
      SetField<int>(ref _whiteScore, value, "WhiteScore");
    }
  }

  public List<GameBoardSquareViewModel> Squares
  {
    get { return _squares; }
  }

  public BoardSquareState NextMove
  {
    get { return _nextMove; }
    private set
    {
      SetField<BoardSquareState>(ref _nextMove, value, "NextMove");
    }
  }

  /// <summary>
  /// Sets up the view model to the initial game state.
  /// </summary>
  private void InitialiseGame()
  {
    foreach (var square in _squares)
    {
      square.State = BoardSquareState.EMPTY;
    }

    GetSquare(3, 4).State = BoardSquareState.BLACK;
    GetSquare(4, 3).State = BoardSquareState.BLACK;
    GetSquare(4, 4).State = BoardSquareState.WHITE;
    GetSquare(3, 3).State = BoardSquareState.WHITE;

    NextMove = BoardSquareState.BLACK;

    WhiteScore = 0;
    BlackScore = 0;
  }
}
```

The `ViewModelBase` class is a pretty standard view model base class that simplifies the process of creating classes that implement `INotifyPropertyChanged`, via the `SetField` method. The `GameBoardViewModel` constructor creates the 8x8 board squares, whilst the `InitialiseGame` method sets the initial state (see Wikipedia for the [rules on the game including the initial set-up](http://en.wikipedia.org/wiki/Reversi))

The `GameBoardSquareViewModel` exposes the row, column and current state of an individual board square:

```csharp
 public class GameBoardSquareViewModel : ViewModelBase
{
  private BoardSquareState _state;

  private GameBoardViewModel _parent;

  public GameBoardSquareViewModel(int row, int col, GameBoardViewModel parent)
  {
    Column = col;
    Row = row;
    _parent = parent;
  }

  public int Column { get; private set; }

  public int Row { get; private set; }

  public BoardSquareState State
  {
    get { return _state; }
    set { SetField<BoardSquareState>(ref _state, value, "State"); }
  }
}
```

Where the state is described by the following enumeration:

```csharp
public enum BoardSquareState
{
  EMPTY,
  BLACK,
  WHITE
}
```

## Creating the Game Graphics

The prevailing style used for Windows 8 apps is the flat ‘metro’ style. However, for this Reversi game I wanted to create something more visually rich, so I opted for the kind of faux-reality that is more often found on the iPad. What can I say? Sometimes I like the look of wood, leather, drop shadows and brushed metal!

I designed the app UI using the free [GIMP](http://www.gimp.org/) painting application. GIMP is a cross-platform graphics package that provides many of the core features found in PhotoShop. I have included the XCF files which shows the various layers that make up the finished imagery. Within this article I’ll provide a brief outline of steps I took to create the graphics.

The first step was to find the wooden background for the board. This was achieved via a Google Search for ‘mahogany’, after browsing the results, I found the background I was looking for:

![Mahogany]({{ site.baseurl }}/ceberhardt/assets/codeproject/Mahogany.jpg)

The next step was to ‘cut out’ the border for the border. This involved selecting a rectangular region, the using the ‘rounded rectangle’ and ‘shrink’ features to create a selection that could be used to cut out the border from the background. The border was pasted as a new layer, then some subtle colour adjustments applied to lighten the wood, and a drop shadow added:

![Border]({{ site.baseurl }}/ceberhardt/assets/codeproject/Border.jpg)

The background of the board was created as a new layer, which was filled green within the same selection used to construct the border. Also a subtle noise rendering was applied to give a felt texture to the board:

![Green]({{ site.baseurl }}/ceberhardt/assets/codeproject/Green.jpg)

A layer containing a radial gradient was added on top of the board to give the following shading effect:

![Gradient]({{ site.baseurl }}/ceberhardt/assets/codeproject/Gradient.jpg)

The grid pattern was created by constructing an 8x8 pixels layer, then manually filling the alternate pixels with black in order to create a grid. This layer was then scaled to the board size (without smoothing) in order to create a grid of the correct size. The opacity of the grid layer was reduced to about 20% giving the following effect:

![squares]({{ site.baseurl }}/ceberhardt/assets/codeproject/squares.jpg)

The various game texts were rendered using the “Script MT” font, with a drop shadow. Finally, a couple of playing pieces were drawn using a combination of circular selections, drop shadows and embossing.

Here are the completed game graphics:

![Complete]({{ site.baseurl }}/ceberhardt/assets/codeproject/Complete.jpg)

## Creating the View

Because Windows 8 devices cover a range of different screen sizes, it is not possible to use a single image as the view for your application. In order to construct the view for the Reversi board I dis-assembled the various components of the game graphics, re-assembling them using a grid layout.

A further requirement of Windows 8 applications is that they gracefully handle the various application view states, which include portrait, landscape, snapped and filled. For the Reversi game in order to elegantly accommodate these various states I wanted to change the position of the various components. For example in landscape mode displaying the scores to the right of the board, whilst in portrait mode displaying the scores beneath the board.

The Windows 8 sample applications have a class, `LayoutAwarePage`, that translates view state changes into visual states making it possible to handle these various states entirely within XAML via the `VisualStateManager`.

In order to make re-usable UI components typically you would construct user controls. However, if you simply want to re-use the same XAML markup, without adding any extra functionality or behavior, there is a simpler approach available via the `ContentControl`.

The `ReversiView` defines a number of templates as follows:

```xml
<ControlTemplate x:Key="BlackScoreTemplate">
  <Viewbox>
    <Grid Width="150" Height="150">
      <Image Source="Assets/BlackPiece.png" Stretch="Uniform"/>
      <TextBlock Text="{Binding BlackScore}" VerticalAlignment="Center" HorizontalAlignment="Center"
                  FontSize="50"/>
    </Grid>
  </Viewbox>
</ControlTemplate>

<ControlTemplate x:Key="RestartGameTemplate">
  <Button Visibility="{Binding Path=GameOver, Converter={StaticResource BoolToVisibilityConverter}}"
          Command="{Binding Path=RestartGame}"
          Template="{StaticResource PlainButtonTemplate}">
    <Image Source="Assets/GameOver.png"
            Stretch="Uniform" Margin="40"
            VerticalAlignment="Top"/>
  </Button>
</ControlTemplate>

<ControlTemplate x:Key="ReversiTitleTemplate">
  <Image Source="Assets/ReversiText.png"
          Stretch="Uniform"
          Margin="0,80,0,0"/>
</ControlTemplate>

<ControlTemplate x:Key="WhiteScoreTemplate">
  <Viewbox>
    <Grid Width="150" Height="150">
      <Image Source="Assets/WhitePiece.png" Stretch="Uniform"/>
      <TextBlock Text="{Binding WhiteScore}" VerticalAlignment="Center" HorizontalAlignment="Center"
                  FontSize="50" Foreground="Black"/>
    </Grid>
  </Viewbox>
</ControlTemplate>

<ControlTemplate x:Key="ReversiBoardTemplate">
  <Viewbox>
    <Grid Margin="20">
      <Image Source="Assets/Board.png" Stretch="UniformToFill"/>
      <ItemsControl ItemsSource="{Binding Squares}">
        <ItemsControl.ItemsPanel>
          <ItemsPanelTemplate>
            <Grid Width="1200" Height="1200" x:Name="boardContainer"
                    common:GridUtils.RowDefinitions="*,*,*,*,*,*,*,*"
                    common:GridUtils.ColumnDefinitions="*,*,*,*,*,*,*,*">
            </Grid>
          </ItemsPanelTemplate>
        </ItemsControl.ItemsPanel>
        <ItemsControl.ItemTemplate>
          <DataTemplate>
            <local:BoardSquareView Grid.Row="{Binding Row}" Grid.Column="{Binding Column}"
                                      Width="150" Height="150"/>
          </DataTemplate>
        </ItemsControl.ItemTemplate>
      </ItemsControl>
    </Grid>
  </Viewbox>
</ControlTemplate>
```

Each of these templates defines a re-usable UI component, each of which uses a PNG file which is rendered using a number of different layers from the GIMP graphics. Note that a few of these templates make use of the `Viewbox` control which is very useful for scaling your application UI in order to accommodate different screen sizes.

The `ReversiView` content is as follows:

```xml
 <Grid>

  <VisualStateManager.VisualStateGroups>
    <VisualStateGroup x:Name="ApplicationViewStates">
      <VisualState x:Name="FullScreenLandscape">
        <Storyboard>
          <ObjectAnimationUsingKeyFrames Storyboard.TargetName="FilledLayout" Storyboard.TargetProperty="Visibility">
            <DiscreteObjectKeyFrame KeyTime="0" Value="Collapsed"/>
          </ObjectAnimationUsingKeyFrames>
          <ObjectAnimationUsingKeyFrames Storyboard.TargetName="PortraitLayout" Storyboard.TargetProperty="Visibility">
            <DiscreteObjectKeyFrame KeyTime="0" Value="Collapsed"/>
          </ObjectAnimationUsingKeyFrames>
          <ObjectAnimationUsingKeyFrames Storyboard.TargetName="LandscapeLayout" Storyboard.TargetProperty="Visibility">
            <DiscreteObjectKeyFrame KeyTime="0" Value="Visible"/>
          </ObjectAnimationUsingKeyFrames>
        </Storyboard>
      </VisualState>
      ... further visual states omitted ...
    </VisualStateGroup>
  </VisualStateManager.VisualStateGroups>

  <Image Source="Assets/Background.jpg" Stretch="UniformToFill"/>

  <!--Portrait / snapped layout -->
  <Grid x:Name="PortraitLayout"
        common:GridUtils.ColumnDefinitions="*,*"
        common:GridUtils.RowDefinitions="*,3*,0.5*,*">
    <ContentControl Grid.ColumnSpan="2"
                    Template="{StaticResource ReversiTitleTemplate}"/>
    <ContentControl Grid.ColumnSpan="2" Grid.Row="1"
                    Template="{StaticResource ReversiBoardTemplate}"/>
    <ContentControl VerticalAlignment="Bottom" Grid.Row="2"
                    Template="{StaticResource BlackScoreTemplate}"/>
    <ContentControl VerticalAlignment="Bottom" Grid.Column="1" Grid.Row="2"
                    Template="{StaticResource WhiteScoreTemplate}"/>
    <ContentControl Grid.Row="3" Grid.ColumnSpan="2" HorizontalAlignment="Center"
                    Template="{StaticResource RestartGameTemplate}"/>
  </Grid>

  <!-- Filled layout -->
  <Grid x:Name="FilledLayout"
        common:GridUtils.ColumnDefinitions="3*,*,*"
        common:GridUtils.RowDefinitions="*,0.4*,*">
    <ContentControl VerticalAlignment="Bottom" Grid.Column="1" Grid.Row="1"
                    Template="{StaticResource BlackScoreTemplate}"/>
    <ContentControl Grid.Column="1" Grid.ColumnSpan="2"
                    Template="{StaticResource ReversiTitleTemplate}"/>
    <ContentControl Grid.Column="1" Grid.ColumnSpan="2" Grid.Row="2"
                    Template="{StaticResource RestartGameTemplate}"/>
    <ContentControl Grid.Column="0" Grid.RowSpan="3"
                    Template="{StaticResource ReversiBoardTemplate}"/>
    <ContentControl Grid.Column="2" Grid.Row="1"
                    Template="{StaticResource WhiteScoreTemplate}"/>
  </Grid>

  <!-- Landscape layout -->
  <Grid x:Name="LandscapeLayout"
        common:GridUtils.ColumnDefinitions="Auto,*,*"
        common:GridUtils.RowDefinitions="*,0.5*,*">
    <ContentControl VerticalAlignment="Bottom" Grid.Column="1" Grid.Row="1"
                    Template="{StaticResource BlackScoreTemplate}"/>
    <ContentControl Grid.Column="1" Grid.ColumnSpan="2"
                    Template="{StaticResource ReversiTitleTemplate}"/>
    <ContentControl Grid.Column="1" Grid.ColumnSpan="2" Grid.Row="2"
                    Template="{StaticResource RestartGameTemplate}"/>
    <ContentControl Grid.Column="0" Grid.RowSpan="3"
                    Template="{StaticResource ReversiBoardTemplate}"/>
    <ContentControl VerticalAlignment="Bottom" Grid.Column="2" Grid.Row="1"
                    Template="{StaticResource WhiteScoreTemplate}"/>
  </Grid>
</Grid>
```

As you can see in the above code the application has three distinct layouts, where the `VisualStateManager` shows / hides each layout based on the current application view state. The use of `ContentControls` ensures full re-use of the view components, it also allows you to clearly see the various layouts.

With Visual Studio you can test the states via the device panel. Here is the game in landscape mode:

![landscape]({{ site.baseurl }}/ceberhardt/assets/codeproject/landscape.jpg)

And here it is in portrait mode where you can see the different layout that has been applied:

![portrait]({{ site.baseurl }}/ceberhardt/assets/codeproject/portrait.jpg)

It is also advisable to test your application against all the different display resolution, again this is possible via the ‘Display’ property on the Device panel.

Each square on the board is rendered using a `BoardSqureView`. You might have noticed the use of an `ItemsControl` bound to the Squares property of the view model within the `ReversiBoardTemplate`. This ensures that a `BoardSquareView` is constructed for each of the 64 squares on the board. The `BoardSquareView` simply shows/hides the black or white playing piece based on the state of the square it is bound to.

The `ItemsControl` creates a `ContentPresenter` to host each `BoardSquareView` instance. It is these `ContentPresenter` instances that are added to the `Grid` which is specified as the `ItemsPanel`. In order to correctly arrange each square within the `Grid` the `Grid.Row` and `Grid.Column` must be correctly set on each `ContentPresenter`. With WPF this is possible by specifying an `ItemContainerStyle` with bindings for the attached Grid properties. Unfortunately Windows 8 Store apps do not support this feature.

As a workaround for this problem, the `BoardSquareView` sets up the required bindings in code:

```csharp
public sealed partial class BoardSquareView : UserControl
{
  public BoardSquareView()
  {
    this.InitializeComponent();

    this.LayoutUpdated += BoardSquareView_LayoutUpdated;
  }

  void BoardSquareView_LayoutUpdated(object sender, object e)
  {
    var container = VisualTreeHelper.GetParent(this) as FrameworkElement;

    container.SetBinding(Grid.RowProperty, new Binding()
    {
      Source = this.DataContext,
      Path = new PropertyPath("Row")
    });

    container.SetBinding(Grid.ColumnProperty, new Binding()
    {
      Source = this.DataContext,
      Path = new PropertyPath("Column")
    });
  }
}
```

This pretty much covers all the interesting points relating to the view, so it’s time to take a closer look at the game logic…

## The Reversi Game Logic

The `GameBoardViewModel` keeps track of the score for each player, which player has the next turn and whether the game has finished - these are all pretty simple tasks. The more complex tasks this view model performs relate to enforcing the logic of the game of Reversi.

When a player taps on the board, this is picked up by the `Button` that is rendered by the tapped `BoardSquareView`. This button is bound to a command that is exposed by the `GameBoardSquareViewModel`, which then informs the `GameBoardViewModel` that the player has attempted to make a move. All pretty straightforward stuff.

When the player taps a cell, the following sequence of events occurs:

1. Check if the move is valid (if not … abort!)
2. Set the state of the tapped cells.
3. Flip any of the opponent’s counters that were surrounded.
4. Swap turns
5. Check that the opponent can make a turn – if not swap back.
6. Check to see if the game has finished
7. Updated the scores

This all takes place within the following method expose by `GameBoardViewModel`:

```csharp
/// <summary>
/// Makes the given move for the current player. Score are updated and play then moves
/// to the next player.
/// </summary>
public void MakeMove(int row, int col)
{
  // is this a valid move?
  if (!IsValidMove(row, col, NextMove))
    return;

  // set the square to its new state
  GetSquare(row, col).State = NextMove;

  // flip the opponents counters
  FlipOpponentsCounters(row, col, NextMove);

  // swap moves
  NextMove = InvertState(NextMove);

  // if this player cannot make a move, swap back again
  if (!CanPlayerMakeAMove(NextMove))
  {
    NextMove = InvertState(NextMove);
  }

  // check whether the game has finished
  GameOver = HasGameFinished();

  // update the scores
  BlackScore = _squares.Count(s => s.State == BoardSquareState.BLACK);
  WhiteScore = _squares.Count(s => s.State == BoardSquareState.WHITE);
}
```

We’ll have a look at how the view model determines whether a move is valid, within `I``sValidMove`, in a bit more detail.

With the game of Reversi a move is valid if it surrounds one or more of the opponent’s counters either horizontally or diagonally. This means that the view model must search in 8 different directions in order to look for surrounded counters. Rather than write the same logic 8 times over, I decided to decouple the logic that determines whether counters are surrounded from the logic which navigates the board in each direction.

Firstly I defined a delegate which is used to update the row and column that is passed to it. The view model creates 8 instances of this delegate, one to represent each direction that the board can be navigated in:

```csharp
delegate void NavigationFunction(ref int row, ref int col);

private static List<NavigationFunction> _navigationFunctions = new List<NavigationFunction>();

static GameBoardViewModel()
{
  _navigationFunctions.Add(delegate(ref int row, ref int col) { row++; });
  _navigationFunctions.Add(delegate(ref int row, ref int col) { row--; });
  _navigationFunctions.Add(delegate(ref int row, ref int col) { row++; col--; });
  _navigationFunctions.Add(delegate(ref int row, ref int col) { row++; col++; });
  _navigationFunctions.Add(delegate(ref int row, ref int col) { row--; col--; });
  _navigationFunctions.Add(delegate(ref int row, ref int col) { row--; col++; });
  _navigationFunctions.Add(delegate(ref int row, ref int col) { col++; });
  _navigationFunctions.Add(delegate(ref int row, ref int col) { col--; });
}
```

The view model uses these navigation functions in order to provide a list of squares that are encountered when navigating in a certain direction from a specific starting point:

```csharp
/// <summary>
/// A list of board squares that are yielded via the given navigation function.
/// </summary>
private IEnumerable<GameBoardSquareViewModel> NavigateBoard(NavigationFunction navigationFunction,
                                                            int row, int column)
{
  navigationFunction(ref column, ref row);
  while (column >= 0 && column <= 7 && row >= 0 && row <= 7)
  {
    yield return GetSquare(row, column);
    navigationFunction(ref column, ref row);
  }
}
```

This neatly wraps up both the logic of navigating the board in a certain direction together with the need to check the bounds of the board.

`IsValidMove` uses the collection of navigation functions to determine whether a move is valid, as you can see by the use of the `Any` Linq method:

```
/// <summary>
/// Determines whether the given move is valid
/// </summary>
public bool IsValidMove(int row, int col, BoardSquareState state)
{
  // check the cell is empty
  if (GetSquare(row, col).State != BoardSquareState.EMPTY)
    return false;

  // if counters are surrounded in any direction, the move is valid
  return _navigationFunctions.Any(navFunction => MoveSurroundsCounters(row, col, navFunction, state));
}
```

The `Any` query uses the `MoveSurroundsCounter` method, which provides the ‘guts’ of the logic:

```csharp
/// <summary>
/// Determines whether the given move 'surrounds' any of the opponents pieces.
/// </summary>
private bool MoveSurroundsCounters(int row, int column,
  NavigationFunction navigationFunction, BoardSquareState state)
{
  int index = 1;

  var squares = NavigateBoard(navigationFunction, row, column);
  foreach(var square in squares)
  {
    BoardSquareState currentCellState = square.State;

    // the cell that is the immediate neighbour must be of the other colour
    if (index == 1)
    {
      if (currentCellState != InvertState(state))
      {
        return false;
      }
    }
    else
    {
      // if we have reached a cell of the same colour, this is a valid move
      if (currentCellState == state)
      {
        return true;
      }

      // if we have reached an empty cell - fail
      if (currentCellState == BoardSquareState.EMPTY)
      {
        return false;
      }
    }

    index++;
  }

  return false;
}
```

In the above code you can see that it makes use of the `NavigateBoard` function in order to traverse the squares in the direction dictated by the navigation function.

If a move is valid, the pieces that are surrounded in each of the 8 directions are ‘flipped’. Again, this makes use of the navigation functions.

```csharp
/// <summary>
/// Flips all the opponents pieces that are surrounded by the given move.
/// </summary>
private void FlipOpponentsCounters(int row, int column, BoardSquareState state)
{
  foreach (var navigationFunction in _navigationFunctions)
  {
    // are any pieces surrounded in this direction?
    if (!MoveSurroundsCounters(row, column, navigationFunction, state))
      continue;

    BoardSquareState opponentsState = InvertState(state);

    var squares = NavigateBoard(navigationFunction, row, column);
    foreach (var square in squares)
    {
      if (square.State == state)
        break;

      square.State = state;
    }
  }
}
```

Finally, the check to see whether the game is over simply takes the brute force approach of checking each and every square to see if it is a valid move for each player:

```csharp
private bool HasGameFinished()
{
    return  !CanPlayerMakeAMove(BoardSquareState.BLACK) &&
            !CanPlayerMakeAMove(BoardSquareState.WHITE);
}

/// <summary>
/// Determines whether there are any valid moves that the given player can make.
/// </summary>
private bool CanPlayerMakeAMove(BoardSquareState state)
{
    // test all the board locations to see if a move can be made
    for (int row = 0; row < 8; row++)
    {
        for (int col = 0; col < 8; col++)
        {
            if (IsValidMove(row, col, state))
            {
                return true;
            }
        }
    }
    return false;
}
```

This completes the game logic!

## A Computer Player – the Minimax Algorithm

**“I'm afraid that some times, you'll play lonely games too. Games you can't win, 'cause you'll play against you.” ― Dr. Seuss, Oh, the Places You'll Go!**

If you haven’t got anyone to play against, do not despair, we’ll create you a computer opponent to keep you occupied!

The class which represents the computer opponent is initialized with the game view model, which it observes in order to determine when it is the computer turn:

```csharp
public class ComputerOpponent
{
  private int _maxDepth;

  private GameBoardViewModel _viewModel;

  private BoardSquareState _computerColor;

  public ComputerOpponent(GameBoardViewModel viewModel, BoardSquareState computerColor, int maxDepth)
  {
    _maxDepth = maxDepth;
    _computerColor = computerColor;
    _viewModel = viewModel;
    _viewModel.PropertyChanged += GameBoardViewModel_PropertyChanged;

    MakeMoveIfCorrectTurn();
  }

  private void GameBoardViewModel_PropertyChanged(object sender, PropertyChangedEventArgs e)
  {
    if (e.PropertyName == "NextMove")
    {
      MakeMoveIfCorrectTurn();
    }
  }
  ...
}
```

The computer takes a brute force approach to determining the move to make. It analyses every single potential next move, then scores them, picking the best one:

```csharp
private void MakeNextMove()
{
  Move bestMove = new Move()
  {
    Column = -1,
    Row = -1
  };
  int bestScore = int.MinValue;

  // check every valid move for this particular board, then select the one with the best 'score'
  List<Move> moves = ValidMovesForBoard(_viewModel);
  foreach (Move nextMove in moves)
  {
    // clone the current board and make this move
    GameBoardViewModel testBoard = new GameBoardViewModel(_viewModel);
    testBoard.MakeMove(nextMove.Row, nextMove.Column);

    // determine the score for this move
    int scoreForMove = ScoreForBoard(testBoard, 1);

    // pick the best
    if (scoreForMove > bestScore || bestScore == int.MinValue)
    {
      bestScore = scoreForMove;
      bestMove.Row = nextMove.Row;
      bestMove.Column = nextMove.Column;
    }
  }

  if (bestMove.Column != -1 && bestMove.Row != -1)
  {
    _viewModel.MakeMove(bestMove.Row, bestMove.Column);
  }
}<span style="white-space: normal;">
</span>
```

As you can see in the above code, the `GameBoardViewModel` has a handy copy constructor which allows the computer opponent to perform the required what-if analysis.

The `ScoreForBoard` method is an interesting one, before we get into that, we’ll introduce the minimax algorithm.

The computer could choose its next move based on the difference in score that each potential move would make, picking the best one. As an example, if the computer determines that there are three different moves that it can make, then it will pick the one with the highest score as illustrated below:

![MiniMaxDepthOne]({{ site.baseurl }}/ceberhardt/assets/codeproject/MiniMaxDepthOne.png)

However, if you look at the next turn, the opponent (i.e. you!) will be trying to minimize the exact same score that the computer is trying to maximize. In the example below, if you look at what happens on the next turn, the situation will be a bit different:

![MiniMaxDepthTwo]({{ site.baseurl }}/ceberhardt/assets/codeproject/MiniMaxDepthTwo.png)

With the one-step look ahead model, the computer would have picked the move that resulted in a score of ‘5’, i.e. the move marked ‘A’. However, on the next turn, a skilled human opponent would pick the move that gives the minimum score for the computer, and thus would select move ‘B’.

You can see that by looking ahead to the next round of moves, it’s easy to determine that ‘C’ is the move that will result in the best score, with the expectation that the next move after that will be ‘D’.

But why stop there? The computer, it its infinite wisdom and computing power, can continue to analyze the tree of potential moves and game states, even all the way to the end of the game! In comparison, a human competitor will struggle to look more than a few steps ahead.

The approach described here is a [minimax algorithm](http://en.wikipedia.org/wiki/Minimax) where one player seeks to maximize their game score, while their opponent seeks to minimize this same score.

In order to make use of the minimax algorithm, the `ScoreForBoard` computes the score for each move recursively:

```csharp
// Computes the score for the given board
private int ScoreForBoard(GameBoardViewModel board, int depth)
{
  // if we have reached the maximum search depth, then just compute the score of the current
  // board state
  if (depth >= _maxDepth)
  {
    return _computerColor == BoardSquareState.WHITE ?
                              board.WhiteScore - board.BlackScore :
                              board.BlackScore - board.WhiteScore;
  }

  int minMax = int.MinValue;

  // check every valid next move for this particular board
  List<Move> moves = ValidMovesForBoard(board);
  foreach (Move nextMove in moves)
  {
    // clone the current board and make the move
    GameBoardViewModel testBoard = new GameBoardViewModel(board);
    testBoard.MakeMove(nextMove.Row, nextMove.Column);

    // compute the score for this board
    int score = ScoreForBoard(testBoard, depth + 1);

    // pick the best score
    if (depth % 2 == 0)
    {
      if (score > minMax || minMax == int.MinValue)
      {
        minMax = score;
      }
    }
    else
    {
      if (score < minMax || minMax == int.MinValue)
      {
        minMax = score;
      }
    }
  }

  return minMax;
}
```

You can see in the above code that the algorithm used to compute the score is inverted when `depth%2==0`, i.e. on alternating turns. This reflects the previous description where one player is maximizing the score whilst the other player minimizes the same value.

Putting the computer into action is as simple as creating an instance of this class:

```csharp
var vm = new GameBoardViewModel();
var comp = new ComputerOpponent(vm, BoardSquareState.WHITE, 5);
DataContext = vm;
```

Of course whilst a greater search depth will make the computer player smarter, it will also make it slower.

For a bit of fun, why not create two computer players and watch it play itself? 

## Conclusions

I hope you have enjoyed this tutorial and perhaps learnt something new. There is still much more that could be done with this application, why not try the following:

- Add a visual indicator that shows whose turn is next.
- Add an indicator that highlights which squares represent valid moves for the next turn.
- Add a scoreboard.

The full project sourcecode, including the raw GIMP graphics, is [available on github](https://github.com/ColinEberhardt/ReversiEight).
