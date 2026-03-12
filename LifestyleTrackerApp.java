import java.util.*;

public class LifestyleTrackerApp {
    private static Scanner sc = new Scanner(System.in);
    private static Authenticator auth = new Authenticator(); // CO4: Hash-based AUTH
    private static FoodLibrary foodLib = new FoodLibrary(); // CO1: Search/Sort
    private static RoutineManager routine = new RoutineManager(); // CO2: Doubly Linked List
    private static CircularQueue recentFoods = new CircularQueue(5); // CO3: Circular Queue
    private static PriorityQueue<Task> priorityTasks = new PriorityQueue<>(); // CO3: Heap-based PQ

    public static void main(String[] args) {
        System.out.println("=== WELCOME TO LIFESTYLE TRACKER (DSA CONSOLE) ===");
        
        while (true) {
            System.out.println("\n1. Register\n2. Login\n3. Exit");
            int choice = getIntInput();

            if (choice == 1) {
                System.out.print("Enter Username: ");
                String u = sc.next();
                System.out.print("Enter Password: ");
                String p = sc.next();
                auth.register(u, p);
            } else if (choice == 2) {
                System.out.print("Username: ");
                String u = sc.next();
                System.out.print("Password: ");
                String p = sc.next();
                if (auth.login(u, p)) {
                    showDashboard();
                } else {
                    System.out.println("Invalid Credentials.");
                }
            } else break;
        }
    }

    private static void showDashboard() {
        while (true) {
            System.out.println("\n--- MAIN DASHBOARD ---");
            System.out.println("1. Manage Routine ");
            System.out.println("2. Global Nutrition Library");
            System.out.println("3. High-Priority Task Queue");
            System.out.println("4. Recent Food History");
            System.out.println("5. Logout");
            int choice = getIntInput();

            if (choice == 1) manageRoutine();
            else if (choice == 2) manageNutrition();
            else if (choice == 3) managePriorityTasks();
            else if (choice == 4) viewRecentFoods();
            else break;
        }
    }

    // ==========================================
    // CO1: SEARCHING, SORTING & COMPLEXITY
    // ==========================================
    static class Food {
        String name;
        int calories;
        Food(String n, int c) { this.name = n; this.calories = c; }
        @Override
        public String toString() { return name + " (" + calories + " kcal)"; }
    }

    static class FoodLibrary {
        List<Food> foods = new ArrayList<>();

        FoodLibrary() {
            foods.add(new Food("Idli", 40));
            foods.add(new Food("Biryani", 450));
            foods.add(new Food("Salad", 50));
            foods.add(new Food("Dosa", 120));
        }

        // CO1: Merge Sort - O(N log N)
        void sortByCalories() {
            Collections.sort(foods, (a, b) -> a.calories - b.calories);
            System.out.println("Library sorted by calories.");
        }

        // CO1: Binary Search - O(log N)
        int searchFood(String name) {
            Collections.sort(foods, (a, b) -> a.name.compareToIgnoreCase(b.name));
            int low = 0, high = foods.size() - 1;
            while (low <= high) {
                int mid = (low + high) / 2;
                int cmp = foods.get(mid).name.compareToIgnoreCase(name);
                if (cmp == 0) return mid;
                if (cmp < 0) low = mid + 1;
                else high = mid - 1;
            }
            return -1;
        }
    }

    private static void manageNutrition() {
        System.out.println("\n1. View All\n2. Sort by Calories (MergeSort)\n3. Search Food (BinarySearch)");
        int choice = getIntInput();
        if (choice == 1) foodLib.foods.forEach(System.out::println);
        else if (choice == 2) {
            foodLib.sortByCalories();
            foodLib.foods.forEach(System.out::println);
        } else if (choice == 3) {
            System.out.print("Search: ");
            String query = sc.next();
            int idx = foodLib.searchFood(query);
            if (idx != -1) {
                Food f = foodLib.foods.get(idx);
                System.out.println("Found: " + f);
                recentFoods.enqueue(f.name); // CO3: Circular Queue
            } else System.out.println("Not Found.");
        }
    }

    // ==========================================
    // CO2: LINKED LISTS & ADTs
    // ==========================================
    static class Node {
        String task;
        Node prev, next;
        Node(String t) { this.task = t; }
    }

    static class RoutineManager {
        Node head, tail;

        // CO2: Insert O(1)
        void addTask(String t) {
            Node newNode = new Node(t);
            if (head == null) head = tail = newNode;
            else {
                tail.next = newNode;
                newNode.prev = tail;
                tail = newNode;
            }
        }

        // CO2: Delete O(N)
        void removeTask(String t) {
            Node curr = head;
            while (curr != null) {
                if (curr.task.equalsIgnoreCase(t)) {
                    if (curr.prev != null) curr.prev.next = curr.next;
                    else head = curr.next;
                    if (curr.next != null) curr.next.prev = curr.prev;
                    else tail = curr.prev;
                    return;
                }
                curr = curr.next;
            }
        }

        // CO2: Reverse traversal
        void printRoutine(boolean reverse) {
            Node curr = reverse ? tail : head;
            while (curr != null) {
                System.out.print(curr.task + (reverse ? " <- " : " -> "));
                curr = reverse ? curr.prev : curr.next;
            }
            System.out.println("END");
        }
    }

    private static void manageRoutine() {
        System.out.println("\n1. Add Task\n2. Remove Task\n3. View Routine\n4. View Reversed");
        int choice = getIntInput();
        if (choice == 1) {
            System.out.print("Task Name: ");
            routine.addTask(sc.next());
        } else if (choice == 2) {
            System.out.print("Task to remove: ");
            routine.removeTask(sc.next());
        } else if (choice == 3) routine.printRoutine(false);
        else if (choice == 4) routine.printRoutine(true);
    }

    // ==========================================
    // CO3: QUEUES & HEAPS (PRIORITY QUEUE)
    // ==========================================
    static class Task implements Comparable<Task> {
        String name;
        int priority; // 1-High, 10-Low
        Task(String n, int p) { this.name = n; this.priority = p; }
        @Override
        public int compareTo(Task o) { return Integer.compare(this.priority, o.priority); }
        @Override
        public String toString() { return "[Priority " + priority + "] " + name; }
    }

    static class CircularQueue {
        String[] q;
        int front, rear, size, capacity;
        CircularQueue(int c) {
            capacity = c;
            q = new String[c];
            front = size = 0; rear = c - 1;
        }
        void enqueue(String item) {
            if (size == capacity) front = (front + 1) % capacity; // overwrite oldest
            else size++;
            rear = (rear + 1) % capacity;
            q[rear] = item;
        }
        void display() {
            for (int i = 0; i < size; i++) {
                System.out.println(q[(front + i) % capacity]);
            }
        }
    }

    private static void managePriorityTasks() {
        System.out.println("\n1. Add Priority Task (Heap-based Insertion)");
        System.out.println("2. View/Complete Highest Priority (Heap Extract)");
        int choice = getIntInput();
        if (choice == 1) {
            System.out.print("Task: "); String n = sc.next();
            System.out.print("Priority (1-Highest): "); int p = getIntInput();
            priorityTasks.add(new Task(n, p));
        } else if (choice == 2) {
            if (priorityTasks.isEmpty()) System.out.println("No tasks.");
            else System.out.println("Completing: " + priorityTasks.poll());
        }
    }

    private static void viewRecentFoods() {
        System.out.println("\n--- Last 5 Foods Searched (Circular Queue) ---");
        recentFoods.display();
    }

    // ==========================================
    // CO4: HASH-BASED AUTH & COLLECTIONS
    // ==========================================
    static class Authenticator {
        // CO4: Hash Map for O(1) lookups
        private Map<String, String> userDb = new HashMap<>();

        void register(String u, String p) {
            userDb.put(u, p);
            System.out.println("Registered successfully.");
        }

        boolean login(String u, String p) {
            return userDb.containsKey(u) && userDb.get(u).equals(p);
        }
    }

    private static int getIntInput() {
        try { return sc.nextInt(); } catch (Exception e) { sc.nextLine(); return -1; }
    }
}
