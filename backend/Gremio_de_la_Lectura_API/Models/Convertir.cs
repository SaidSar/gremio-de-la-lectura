using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic;
using System.Data.SqlClient;

    public class Convertir {
        private const string t = "dd-MM-yyyy";
        public static string str(SqlDataReader dr, string var ) {
            if(dr[var] == DBNull.Value) 
                return "";
            else
                return dr[var].ToString();
        }
        public static char ch(SqlDataReader dr, string var) {
            if(dr[var] == DBNull.Value)
                return ' ';
            else
                return dr[var].ToString()[0];
        }
        public static int num(SqlDataReader dr, string var) {
            if(dr[var] == DBNull.Value) return 0;
            else
                return Convert.ToInt32(dr[var].ToString());
        }
        public static bool boo(SqlDataReader dr, string var) {
            if(dr[var] == DBNull.Value) return false;
            else
                return Convert.ToBoolean(dr[var]);
        }
        public static DateTime date(SqlDataReader dr, string var) {
            if(dr[var] == DBNull.Value) return DateTime.Now;
            else return Convert.ToDateTime(dr[var]);
        }
        public static decimal dec(SqlDataReader dr, string var) {
            if(dr[var] == DBNull.Value) return 0;
            else
                return Convert.ToDecimal(dr[var].ToString());
        }
    }

