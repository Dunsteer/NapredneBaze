using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlightsBooking
{
    public class Reservation
    {
        public int seatsId { get; set; }
        public int userId { get; set; }
        public bool accepted { get; set; }

        public Reservation(int seatsId, int userId, bool accepted)
        {
            this.seatsId = seatsId;
            this.userId = userId;
            this.accepted = accepted;
        }
    }
}
