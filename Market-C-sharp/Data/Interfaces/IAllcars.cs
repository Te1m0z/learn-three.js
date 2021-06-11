using Market_C_sharp.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Market_C_sharp.Data.Interfaces
{
    public interface IAllcars
    {
        IEnumerable<Car> Cars { get; }

        IEnumerable<Car> getFavCars { get; set; }

        Car getObjectcar(int carId);
    }
}
