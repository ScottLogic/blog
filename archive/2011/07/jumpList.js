/*globals $ setTimeout iScroll*/

var JumpList = {

  // initial values are stored in the widget's prototype
  options: {
    items: [],
    itemTemplate: "itemTemplate",
    categoryFunction: function (item) {
      return item;
    },
    categoryList: undefined,
    useIScroll: false
  },

  // jQuery-UI initialization method
  _init: function () {

    var i, item, jumpListWidth, jumpListHeight,
            category, previousCategory, categoryList,
            jumpButtons = {},
            $itemMarkup,
            $jumpList = $(this.element),
            $itemListContainer = $("<div id='itemListContainer'>"),
            $jumpButton,
            $categoryButton;


    // compile the itemTemplate
    $.template("itemTemplate", this.options.itemTemplate);

    this._$itemList = $("<div class='itemList'/>");
    this._$categoryList = $("<div class='categoryList'>");

    // create the item list with jump buttons
    for (i = 0; i < this.options.items.length; i++) {

      item = this.options.items[i];
      category = this.options.categoryFunction(item);

      if (category !== previousCategory) {
        previousCategory = category;

        // create a jump button and add to the list
        $jumpButton = $("<a class='jumpButton'/>").text(category);
        $jumpButton.attr("id", category.toString());
        this._$itemList.append($jumpButton);

        // store a reference to the button for this category
        jumpButtons[category] = $jumpButton;
      }

      // create an item
      $itemMarkup = $("<div class='jumpListItem'/>");
      $.tmpl("itemTemplate", item).appendTo($itemMarkup);

      // associate the underlying object with this node
      $itemMarkup.data("dataContext", item);

      // add the item to the list
      this._$itemList.append($itemMarkup);
    }

    // add a click handler to the itemList
    this._$itemList.bind("click", { jumpList: this }, this._itemListClickHandler);

    // build the list of categories. If the user has supplied a categoryList, use it
    // otherwise build a list of all categories that are used
    if (this.options.categoryList !== undefined) {
      categoryList = this.options.categoryList;
    } else {
      categoryList = [];
      for (category in jumpButtons) {
        categoryList.push(category);
      }
    }

    // create the category buttons
    for (i = 0; i < categoryList.length; i++) {
      category = categoryList[i];
      $jumpButton = jumpButtons[category];

      // create a button for this category
      $categoryButton = $("<a class='categoryButton'/>").text(category);
      if ($jumpButton === undefined) {
        $categoryButton.addClass("disabled");
      }

      // associate the jump button that this category 'jumps' to with
      // the category button node.
      $categoryButton.data("jumpButton", $jumpButton);

      this._$categoryList.append($categoryButton);
    }

    // add a click handler to the categoryList
    this._$categoryList.bind("click", { jumpList: this }, this._categoryListClickHandler);


    // add the jump list and category list                
    $itemListContainer.append(this._$itemList);
    $jumpList.append($itemListContainer);
    $jumpList.append(this._$categoryList);


    // set the itemList and category list height
    jumpListHeight = $jumpList.height();
    jumpListWidth = $jumpList.width();
    $itemListContainer.height(jumpListHeight);
    this._$categoryList.height(jumpListHeight);
    $itemListContainer.width(jumpListWidth);
    this._$categoryList.width(jumpListWidth);

    this._$itemListContainer = $itemListContainer;

    if (this.options.useIScroll) {
      this._iScroll = new iScroll('itemListContainer'); //ignore jslint
    }

  },
  _categoryListClickHandler: function (event) {
    var jumpList = event.data.jumpList,
            $categoryButton = $(event.target),
            $jumpButton = $categoryButton.data("jumpButton");

    // hide the category buttons
    jumpList._fireAnimations(jumpList._$categoryList.children(), function ($element, isLast) {
      $element.removeClass('show');
      if (isLast) {
        jumpList._$categoryList.removeClass('visible');
      }
    });

    // show the jump list
    jumpList._$itemList.removeClass('faded');

    // scroll the list using either iScroll, or by setting scrolTop directly
    if (jumpList.options.useIScroll) {
      jumpList._iScroll.scrollToElement("#" + $jumpButton.attr("id"), 500);
    } else {
      jumpList._$itemListContainer.scrollTop($jumpButton.position().top + jumpList._$itemListContainer.scrollTop());
    }
  },

  // Handles click on the itemlist, this is either a jump list item or
  // jump button clic;
  _itemListClickHandler: function (event) {
    var jumpList = event.data.jumpList,
            $sourceElement = $(event.target);

    // handler jump list item clicks - resulting in selection changes
    if ($sourceElement.hasClass("jumpListItem")) {
      if (!$sourceElement.hasClass("selected")) {
        // remove any previous selection
        jumpList._$itemList.children(".selected").removeClass("selected");
        // select the clicked element
        $sourceElement.addClass("selected");
        // fire the event
        jumpList._trigger('selectionChanged', 0, $sourceElement.data("dataContext"));
      }
    }

    // handle jump button clicks
    if ($sourceElement.hasClass("jumpButton") === true) {
      // fade out the itemlist and show the categories
      jumpList._$itemList.addClass('faded');
      jumpList._$categoryList.addClass('visible');
      jumpList._fireAnimations(jumpList._$categoryList.children(), function ($element) {
        $element.addClass('show');
      });
    }
  },

  // A function that invokes the given function for each of the elements in 
  // the passed jQuery node-set, with a small delay between each invocation
  _fireAnimations: function ($elements, func) {
    var $lastElement = $elements.last();
    $elements.each(function (index) {
      var $element = $(this);
      setTimeout(function () {
        func($element, $lastElement.is($element));
      }, index * 20);
    });
  },

  _iScroll: undefined,
  _$itemList: undefined,
  _$categoryList: undefined,
  _$itemListContainer: undefined
};

$.widget("ui.jumpList", JumpList);