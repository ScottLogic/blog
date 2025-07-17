import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

import org.junit.Test;

import static org.junit.Assert.*;

public class SortedListTest {

	//Comparator for comparing integers..
	Comparator<Integer> comp = new Comparator<Integer>(){
		public int compare(Integer one, Integer two){
			return one.intValue() - two.intValue();
		}
	}; 
	
    //removes the root of the tree so that it needs to be rebalanced..
    @Test
    public void removeRoot(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(3);
        list.remove(new Integer(30));

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(15);
        test.add(10);
        test.add(35);
        test.add(3);
        test.add(20);
        test.add(40);
        
        assertTrue(list.structurallyEqualTo(test));
    }
    
    //removes the root of the tree so that it needs to be rebalanced..
    @Test
    public void removeNonRootWithTwoChildren(){
        //first where no rebalancing is required..
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(73);
        list.add(3);
        list.add(36);
        list.add(60);
        list.remove(new Integer(40));

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(30);
        test.add(15);
        test.add(60);
        test.add(10);
        test.add(20);
        test.add(35);
        test.add(73);
        test.add(3);
        test.add(36);

        assertTrue(list.structurallyEqualTo(test));
        
        //second where rebalancing is required..
        list.clear();
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(73);
        list.add(3);
        list.add(36);
        list.add(60);
        list.add(83);
        list.add(79);
        list.remove(new Integer(40));

        test.clear();
        test.add(30);
        test.add(15);
        test.add(60);
        test.add(10);
        test.add(20);
        test.add(35);
        test.add(79);
        test.add(3);
        test.add(36);
        test.add(73);
        test.add(83);

        assertTrue(list.structurallyEqualTo(test));
    }

    //removes a left leaf where no rebalancing is required..
    @Test
    public void removeLeaf(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(73);
        list.add(3);
        list.add(36);
        list.add(60);
        list.remove(new Integer(60));

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(30);
        test.add(15);
        test.add(40);
        test.add(10);
        test.add(20);
        test.add(35);
        test.add(73);
        test.add(3);
        test.add(36);
        
        assertTrue(list.structurallyEqualTo(test));
    }
    
    //removes a leaf node where no rebalancing is required..
    @Test
    public void removeLeafWithRebalance(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(73);
        list.add(3);
        list.add(36);
        list.add(60);
        list.remove(new Integer(20));

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(30);
        test.add(10);
        test.add(40);
        test.add(3);
        test.add(15);
        test.add(35);
        test.add(73);
        test.add(36);
        test.add(60);
        
        assertTrue(list.structurallyEqualTo(test));
    }
    
    //removes a node that has a left child but no right one and no rebalancing is required..
    @Test
    public void removeWithJustLeftChild(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(73);
        list.add(3);
        list.add(36);
        list.add(60);
        list.remove(new Integer(73));

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(30);
        test.add(15);
        test.add(40);
        test.add(10);
        test.add(20);
        test.add(35);
        test.add(60);
        test.add(3);
        test.add(36);
        
        assertTrue(list.structurallyEqualTo(test));
    }
    
    //removes a node that has a right child but no left one and no rebalancing is required..
    @Test
    public void removeWithJustRightChild(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(73);
        list.add(3);
        list.add(36);
        list.add(85);
        list.remove(new Integer(73));

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(30);
        test.add(15);
        test.add(40);
        test.add(10);
        test.add(20);
        test.add(35);
        test.add(85);
        test.add(3);
        test.add(36);
        
        assertTrue(list.structurallyEqualTo(test));
    }

    //removes 1 from nodes where each node holds multiple values..
    @Test
    public void removeWhereSizeMoreThanOne(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(73);
        list.add(3);
        list.add(36);
        list.add(60);
        
        list.add(30);
        list.add(15);
        list.add(40);
        list.add(10);
        list.add(20);
        list.add(35);
        list.add(73);
        list.add(3);
        list.add(36);
        list.add(60);
        //remove leaf then root..
        list.remove(new Integer(60));
        list.remove(new Integer(30));

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(30);
        test.add(15);
        test.add(40);
        test.add(10);
        test.add(20);
        test.add(35);
        test.add(73);
        test.add(3);
        test.add(36);
        test.add(60);
        
        test.add(15);
        test.add(40);
        test.add(10);
        test.add(20);
        test.add(35);
        test.add(73);
        test.add(3);
        test.add(36);
        
        assertTrue(list.structurallyEqualTo(test));
    }
    
    //builds a tree where one left rotation is required..
    @Test
    public void addWhereLeftRotateRequired(){
        //first test when change happens at the root..
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(1);
        list.add(2);
        list.add(3);

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(2);
        test.add(1);
        test.add(3);
        
        assertTrue(list.structurallyEqualTo(test));
        
        //second test where not at the root..
        list.clear();
        list.add(0);
        list.add(-1);
        list.add(1);
        list.add(2);
        list.add(3);

        test.clear();
        test.add(0);
        test.add(-1);
        test.add(2);
        test.add(1);
        test.add(3);
        
        assertTrue(list.structurallyEqualTo(test));
    }
    
    //builds a tree where a double left rotation is required..
    @Test
    public void addWhereDoubleLeftRotateRequired(){
        //first test where change happens as root..
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(1);
        list.add(3);
        list.add(2);

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(2);
        test.add(1);
        test.add(3);
        
        assertTrue(list.structurallyEqualTo(test));
        
        //second test where problem isn't at the root..
        list.clear();
        list.add(0);
        list.add(-1);
        list.add(1);
        list.add(3);
        list.add(2);

        test.clear();
        test.add(0);
        test.add(-1);
        test.add(2);
        test.add(1);
        test.add(3);
        
        assertTrue(list.structurallyEqualTo(test));
    }
    
    //builds a tree where one right rotation is required..
    @Test
    public void addWhereRightRotateRequired(){
        //first test where needs to be done at root..
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(3);
        list.add(2);
        list.add(1);

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(2);
        test.add(1);
        test.add(3);
        
        assertTrue(list.structurallyEqualTo(test));
    
        //second test where not at the root..
        list.clear();
        list.add(0);
        list.add(-1);
        list.add(3);
        list.add(2);
        list.add(1);

        test.clear();
        test.add(0);
        test.add(-1);
        test.add(2);
        test.add(1);
        test.add(3);
        
        assertTrue(list.structurallyEqualTo(test));
    }
    
    //builds a tree where a double right rotation is required..
    @Test
    public void addWhereDoubleRightRotateRequired(){
        //first test where change is at root..
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(3);
        list.add(1);
        list.add(2);

        SortedList<Integer> test = new SortedList<Integer>(comp);
        test.add(2);
        test.add(1);
        test.add(3);

        assertTrue(list.structurallyEqualTo(test));
        
        //second test where it's not at the root..
        list.clear();
        list.add(4);
        list.add(5);
        list.add(3);
        list.add(1);
        list.add(2);

        test.clear();
        test.add(4);
        test.add(5);
        test.add(2);
        test.add(1);
        test.add(3);

        assertTrue(list.structurallyEqualTo(test));
    }
    
    //Sees if the contains method works as expected..
    @Test
    public void contains(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        list.add(5);
        list.add(6);
        list.add(7);
        list.add(8);
        list.add(7);
        list.add(8);

        for(int i = 1; i <= 8; i++){
            assertTrue(list.contains(i));
        }
        assertTrue(!list.contains(9));
    }
    
    //Tests the clear method..
    @Test
    public void clear(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        list.add(1);
        list.add(2);
        list.add(3);
        list.clear();
        
        assertTrue(!list.contains(1));
    }
    
    //Tests the get methods..
    @Test
    public void get(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        
        for(int i = 0; i < 100; i++){
            for(int j = 0; j < 3; j++){
                list.add(i);
            }
        }
        
        for(int i = 0; i < 300; i++){
            assertEquals(i/3, (long) list.get(i));
        }
    }
    
    //Tests the size methods..
    @Test
    public void size(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 100; i++){
            for(int j = 0; j < 100; j++){
                list.add(i);
            }        
        }
        assertEquals(100*100, (long) list.size());
    }
    
    //Tests the toArray() method..
    @Test
    public void toObjectArray(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 100; i++){
            for(int j = 0; j < 3; j++){
                list.add(i);
            }        
        }

        Object [] array = list.toArray();
        assertTrue(array.length == 300);

        for(int i = 0; i < 300; i++){
            assertEquals((long) ((Integer) array[i]), (long) i/3);
        }
    }
    
    //Tests the toArray(T[] array) method..
    @Test
    public void toArrayWithType(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 100; i++){
            for(int j = 0; j < 3; j++){
                list.add(i);
            }        
        }

        //test where array is too small..
        Integer [] array = list.toArray(new Integer[0]);
        assertTrue(array.length == 300);

        for(int i = 0; i < 300; i++){
            assertEquals((long) ((Integer) array[i]), (long) i/3);
        }
        
        //test where array is same size..
        array = list.toArray(new Integer[300]);
        assertTrue(array.length == 300);

        for(int i = 0; i < 300; i++){
            assertEquals((long) ((Integer) array[i]), (long) i/3);
        }
        
        //test where array is too big..
        array = list.toArray(new Integer[1000]);
        array[300] = -1;
        assertTrue(array.length == 1000);

        for(int i = 0; i < 300; i++){
            assertEquals((long) ((Integer) array[i]), (long) i/3);
        }
        assertEquals((long) array[300], -1); 
    }
    
    //Tests the isEmpty method..
    //@Test
    public void isEmpty(){
        assertTrue(new SortedList<Integer>(comp ).isEmpty());
    }
    
    //Tests removing elements using their index..
    @Test
    public void removeWithIndex(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 100; i++){
            list.add(i);
        }
        for(int i = 99; i >= 0; i--){
            list.remove(i);
        }
        assertTrue(list.isEmpty());
    }
    
    //Tests removing values using their value..
    @Test
    public void removeWithValue(){
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 100; i++){
            list.add(i);
        }
        for(int i = 0; i < 100; i++){
            list.remove(new Integer(i));
        }
        assertTrue(list.isEmpty());
    }
    
    //Tests whether the tree remains balanced after many additions and removals.
    @Test
    public void checkBalance() {
        //build a random tree..
        Random rand = new Random(0);
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 10000; i++){
            list.add(rand.nextInt(1000));
        }
        for(int i = 0; i < 400; i++){
            list.remove(i);
        }
        
        assertTrue(list.minBalanceFactor() > -2);
        assertTrue(list.maxBalanceFactor() < 2);
    }
    
    //Tests if the iterators next and hasNext work as expected..
    @Test
    public void iteratorLooping() {
        //build a random tree..
        Random rand = new Random(0);
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 10000; i++){
            list.add(rand.nextInt(100));
        }
        
        //looping through..
        Iterator<Integer> itr = list.iterator();
        int last = Integer.MIN_VALUE;
        while(itr.hasNext()){
            int next = itr.next();
            assertTrue(next >= last);
            last = next;
        }
    }
    
    //Tests if the itr remove method works as expected..
    @SuppressWarnings({"unchecked", "rawtypes"})
    @Test
    public void iteratorRemove() {
        //build a random tree..
        Random rand = new Random(1002);
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 10000; i++){
            list.add(rand.nextInt(100));
        }    
        //Get copy of it..
        List copy = new ArrayList(Arrays.asList(list.toArray()));
        
        //remove 1st, 3rd and last elements..
        Iterator itr = list.iterator();
        itr.next();
        itr.remove();
        itr.next();
        itr.next();
        itr.remove();
        while(itr.hasNext()){
            itr.next();
        }
        itr.remove();
        
        //do the same with the copy..
        copy.remove(0);
        copy.remove(1);
        copy.remove(copy.size()-1);
        
        for(int i = 0; i < copy.size(); i++){
            assertEquals(copy.get(i), list.get(i));
        }
    }
    
    //Tests if the itr throws concurrent modification errors as expected..
    @SuppressWarnings({"rawtypes"})
    @Test
    public void iteratorModException() {
        //build a tree..
        SortedList<Integer> list = new SortedList<Integer>(comp);
        for(int i = 0; i < 100; i++){
            list.add(i);
        }
        
        //get an iterator for it, then modify it..
        Iterator itr = list.iterator();
        list.add(101);

        ConcurrentModificationException modException = null;
        try {
            itr.next();
        } catch(ConcurrentModificationException e){
            modException = e;
        }

        assertTrue(modException != null);
    }
}
