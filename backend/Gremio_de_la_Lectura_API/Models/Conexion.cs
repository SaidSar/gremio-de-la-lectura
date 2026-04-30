namespace SWA.BD {
    public static class Conexion {
        static public string DB() {
            string DB = "Server=LaGuerrera\\SQLEXPRESS;Database=GremioDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;";
            return DB;
        }
    }
}