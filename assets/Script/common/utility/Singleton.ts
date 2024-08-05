/**
 * Singleton
 */
class Singleton {
    public static GetInstance() : Singleton{
        if (Singleton._instance == null){
            Singleton._instance = new Singleton();
        }
        return Singleton._instance;
    }

    private static _instance = null;
}