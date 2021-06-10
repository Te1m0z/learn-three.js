using Market_C_sharp.Data.Interfaces;
using Market_C_sharp.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Market_C_sharp.Data.mocks
{
    public class MockCars : IAllcars
    {

        private readonly ICarsCategory _categoryCars = new MockCategory();
        public IEnumerable<Car> Cars {
            get {

                return new List<Car> {

                    new Car { name = "Tesla", shortDesc = "", longDesc="", img="", price=40000, isFavourite=true, available=true, Category = _categoryCars.AllCategories.First() },
                };
            }

        }
        public IEnumerable<Car> getFavCars { get; set; }

        public Car getObjectcar(int carId)
        {
            throw new NotImplementedException();
        }
    }
}
