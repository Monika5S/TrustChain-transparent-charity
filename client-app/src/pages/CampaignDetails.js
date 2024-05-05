import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";

export function CampaignDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);

    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount);

    navigate("/");
    setIsLoading(false);
  };

  return (
    <div className="px-5 py-3 my-3 mx-5 border border-3 rounded-5">
      {isLoading && "Loading"}

      <div className="w-100 p-5 d-flex justify-content-around align-items-center mt-2">
        <div className="flex-1">
          <img
            src={state.image}
            alt="campaign"
            className="w-100 object-fit-cover rounded-5"
          />
          {/* <div className="mt-2 bg-secondary">
            <div
              className="bg-dark-subtle"
              style={{
                width: `${calculateBarPercentage(
                  state.targetGoal,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div> */}
        </div>

        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Donators" value={donators.length} />
        </div>
      </div>

      <div className="mt-1 d-flex flex-column column-gap-5">
        <div className="flex-2 d-flex flex-column">
          <div>
            <h4 className="text-white uppercase">Creator</h4>

            <div className="my-2 d-flex flex-row align-items-center">
              <div className="w-25 h-25 d-flex align-items-center justify-content-center rounded-5 cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-25 h-25 object-fit-contain"
                />
              </div>
              <div>
                <h4 className="text-white">{state.owner}</h4>
                <p className="my-1">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white text-uppercase">Story</h4>

            <div className="mt-1">
              <p className="">{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className="text-white text-uppercase">Donators</h4>

            <div className="d-flex flex-column column-gap-2">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="d-flex justify-content-start align-items-center column-gap-2"
                  >
                    <p className="">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="">{item.donation}</p>
                  </div>
                ))
              ) : (
                <p className="">No donators yet. Be the first one!</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-white">Fund</h4>

          <div className="d-flex rounded-3">
            <p className="text-left">Fund the campaign</p>
            <div className="mt-3">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-50 py-2 bg-transparent  text-white placeholder:text-[#4b5264] rounded-3"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="rounded-3">
                <h4 className="text-white">
                  Back it because you believe in it.
                </h4>
                <p className="">
                  Support the project for no reward, just because it speaks to
                  you.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-auto bg-primary"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
