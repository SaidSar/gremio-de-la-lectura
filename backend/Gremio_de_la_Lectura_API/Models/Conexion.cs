namespace SWA.BD {
    public static class Conexion {
        static public string DB() {
            string DB = "Server=ASUS-VB15-JCL\\SQLEXPRESS;Database=GremioDB;User Id=sa;Password=1202;TrustServerCertificate=True;";
            // DB = "Server=LaGuerrera\\SQLEXPRESS;Database=GremioDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;";
            return DB;
        }
    }
}