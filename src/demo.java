import java.util.Scanner;

class demo {
    static String staticVar  = "Hello";
    String inst = "Hello from Inst";

    public void printVar() {
        String localVar = "Hello from Local";
        System.out.println("Local Variable : " + localVar);
        System.out.println("Insta Variable : " + inst);
        System.out.println("Static Variable : " + staticVar);
        Scanner scn = new Scanner(System.in);
        staticVar = scn.nextLine();

    }
    
}
class Hello {
    public static void main(String[] args) {
        demo dm = new demo();
        dm.printVar();
        demo dm1 = new demo();
        dm1.printVar();
    }
}