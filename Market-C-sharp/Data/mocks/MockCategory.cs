using Market_C_sharp.Data.Interfaces;using Market_C_sharp.Data.Models;using System;using System.Collections.Generic;using System.Linq;using System.Threading.Tasks;namespace Market_C_sharp.Data.mocks{    public class MockCategory : ICarsCategory    {        public IEnumerable<Category> AllCategories {            get {                return new List<Category> {

                    new Category { categoryName = "Электромобили", description = "Современный вид транспорта" },
                    new Category { categoryName = "Классические автомобили", description = "машины с двигателем внутреннего сгорания" }
                };            }        }    }}