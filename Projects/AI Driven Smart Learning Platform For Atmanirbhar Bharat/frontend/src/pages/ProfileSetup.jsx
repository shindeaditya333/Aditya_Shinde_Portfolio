import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "../components/ProfileSetup.css";

const ProfileSetup  = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [educationList, setEducationList] = useState([
    {
      educationType: "",
      collegeName: "",
      specialization: "",
      cgpa: "",
      admissionYear: "",
      passingYear: ""
    }
  ]);

  const [experienceList, setExperienceList] = useState([
    {
      experienceType: "",
      role: "",
      companyName: "",
      duration: "",
      description: ""
    }
  ]);
  const [success, setSuccess] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [profileData, setProfileData] = useState({

    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",

    skills: "",

    languages: "",

    linkedin: "",
    github: "",
    portfolio: "",
    leetcode: "",

    education: [],

    experience: []

  });

  const handleChange = (e) => {

    setProfileData({

      ...profileData,

      [e.target.name]: e.target.value

    });

  };

  const handleEducationChange = (
    index,
    e
  ) => {

    const updatedEducation = [...educationList];

    updatedEducation[index][e.target.name]
      = e.target.value;

    setEducationList(updatedEducation);

  };

  const handleExperienceChange = (
    index,
    e
  ) => {

    const updatedExperience = [...experienceList];

    updatedExperience[index][e.target.name]
      = e.target.value;

    setExperienceList(updatedExperience);

  };

  const saveProfile = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

        const formData = new FormData();

        formData.append("userId", user._id);

        formData.append(
          "phone",
          profileData.phone
        );

        formData.append(
          "dob",
          profileData.dob
        );

        formData.append(
          "gender",
          profileData.gender
        );

        formData.append(
          "address",
          profileData.address
        );

        formData.append(
          "skills",
          JSON.stringify(
            profileData.skills
              .split(",")
              .map(skill => skill.trim())
          )
        );

        formData.append(
          "languages",
          JSON.stringify(
            profileData.languages
              .split(",")
              .map(lang => lang.trim())
          )
        );

        formData.append(
          "linkedin",
          profileData.linkedin
        );

        formData.append(
          "github",
          profileData.github
        );

        formData.append(
          "portfolio",
          profileData.portfolio
        );

        formData.append(
          "leetcode",
          profileData.leetcode
        );

        formData.append(
          "education",
          JSON.stringify(educationList)
        );

        formData.append(
          "experience",
          JSON.stringify(experienceList)
        );

        if (profilePic) {

          formData.append(
            "profilePic",
            profilePic
          );

        }

        if (resume) {

          formData.append(
            "resume",
            resume
          );

        }

        await axios.post(

          "http://localhost:5000/api/auth/save-profile",

          formData,

          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }

        );

      setSuccess("Profile Saved Successfully");

    } catch (error) {

      console.log(error);

      alert("Error Saving Profile");

    }

  };

  return (

    <>
    
    <div className="dashboard-container">

      <div className="dashboard-header">

        <div>
          <h1>Complete Your Profile 👋</h1>

          <p>
            Build your professional profile.
          </p>
        </div>

      </div>

      <div className="profile-card">

        <div className="steps">

          <div className={page === 1 ? "step active-step" : "step"}>
            Personal Info
          </div>

          <div className={page === 2 ? "step active-step" : "step"}>
            Education
          </div>

          <div className={page === 3 ? "step active-step" : "step"}>
            Skills & Experience
          </div>

          <div className={page === 4 ? "step active-step" : "step"}>
            Resume & Links
          </div>

        </div>

        {/* PAGE 1 */}

        {
          page === 1 &&

          <div>

            <div className="form-grid">

              <div className="input-group">
                <label>Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfilePic(e.target.files[0])
                  }
                />
              </div>

              <div className="input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={profileData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={profileData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={profileData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Date of Birth</label>

                <input
                  type="date"
                  name="dob"
                  value={profileData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Gender</label>

                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                >
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="input-group full-width">
                <label>Address</label>

                <textarea
                  name="address"
                  placeholder="Enter address"
                  value={profileData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

            </div>

          </div>
        }

        {/* PAGE 2 */}

        {
            page === 2 &&

            <div className="scroll-page">

                {
                educationList.map((item, index) => (

                    <div className="education-card" key={index}>

                    <h3 className="section-title">
                        Education {index + 1}
                    </h3>

                    <div className="form-grid">

                        <div className="input-group">

                        <label>Education Type</label>

                        <select
                          name="educationType"
                          value={item.educationType}
                          onChange={(e) =>
                            handleEducationChange(index, e)
                          }
                        >

                            <option>Select Education</option>
                            <option>B.E / B.Tech</option>
                            <option>B.Sc</option>
                            <option>BCA</option>
                            <option>B.Com</option>
                            <option>Diploma</option>
                            <option>M.Tech</option>
                            <option>MBA</option>
                            <option>MCA</option>
                            <option>12th</option>
                            <option>10th</option>

                        </select>

                        </div>

                        <div className="input-group">
                        <label>College / School Name</label>

                        <input
                          type="text"
                          name="collegeName"
                          placeholder="Enter institute name"
                          value={item.collegeName}
                          onChange={(e) =>
                            handleEducationChange(index, e)
                          }
                        />
                        </div>


                        <div className="input-group">
                        <label>Specialization</label>

                        <input
                          type="text"
                          name="specialization"
                          placeholder="Enter specialization"
                          value={item.specialization}
                          onChange={(e) =>
                            handleEducationChange(index, e)
                          }
                        />
                        </div>

                        <div className="input-group">
                        <label>CGPA / Percentage</label>

                        <input
                          type="text"
                          name="cgpa"
                          placeholder="Enter CGPA or %"
                          value={item.cgpa}
                          onChange={(e) =>
                            handleEducationChange(index, e)
                          }
                        />
                        </div>


                        <div className="input-group">
                        <label>Admission Year</label>

                        <input
                          type="text"
                          name="admissionYear"
                          placeholder="Enter admission year"
                          value={item.admissionYear}
                          onChange={(e) =>
                            handleEducationChange(index, e)
                          }
                        />
                        </div>


                        <div className="input-group">
                        <label>Passing Year</label>

                        <input
                          type="text"
                          name="passingYear"
                          placeholder="Enter passing year"
                          value={item.passingYear}
                          onChange={(e) =>
                            handleEducationChange(index, e)
                          }
                        />
                        </div>

                    </div>


                    {
                    educationList.length > 1 &&

                    <button
                        type="button"
                        className="remove-btn"
                        onClick={() => {
                        const updatedList = [...educationList];
                        updatedList.splice(index, 1);
                        setEducationList(updatedList);
                        }}
                    >
                        Remove Education
                    </button>
                    }


                    </div>
                ))
                }

                <button
                className="add-btn"
                onClick={() =>
                  setEducationList([
                    ...educationList,
                    {
                      educationType: "",
                      collegeName: "",
                      specialization: "",
                      cgpa: "",
                      admissionYear: "",
                      passingYear: ""
                    }
                  ])
                }
                >
                + Add Education
                </button>


            </div>
            }

        {/* PAGE 3 */}

        {
            page === 3 &&

            <div className="scroll-page">

                <div className="education-card">

                <h3 className="section-title">
                    Skills
                </h3>

                <div className="form-grid">

                    <div className="input-group full-width">

                    <label>Skills</label>

                    <textarea
                        name="skills"
                        placeholder="Java, React, Python, Communication..."
                        value={profileData.skills}
                        onChange={handleChange}
                    ></textarea>

                    </div>

                </div>

                </div>

                {
                experienceList.map((item, index) => (

                    <div className="education-card" key={index}>

                    <h3 className="section-title">
                        Experience {index + 1}
                    </h3>

                    <div className="form-grid">

                        <div className="input-group">

                        <label>Experience Type</label>

                        <select
                          name="experienceType"
                          value={item.experienceType}
                          onChange={(e) =>
                            handleExperienceChange(index, e)
                          }
                        >

                            <option>Select Type</option>
                            <option>Internship</option>
                            <option>Employee</option>
                            <option>Freelancer</option>
                            <option>Part Time</option>
                            <option>Full Time</option>
                            <option>Trainee</option>

                        </select>

                        </div>

                        <div className="input-group">

                        <label>Role</label>

                        <input
                          type="text"
                          name="role"
                          placeholder="Frontend Developer"
                          value={item.role}
                          onChange={(e) =>
                            handleExperienceChange(index, e)
                          }
                        />
                        </div>

                        <div className="input-group">

                        <label>Company Name</label>

                        <input
                          type="text"
                          name="companyName"
                          placeholder="Enter company name"
                          value={item.companyName}
                          onChange={(e) =>
                            handleExperienceChange(index, e)
                          }
                        />

                        </div>

                        <div className="input-group">

                        <label>Duration</label>

                        <input
                          type="text"
                          name="duration"
                          placeholder="6 Months"
                          value={item.duration}
                          onChange={(e) =>
                            handleExperienceChange(index, e)
                          }
                        />

                        </div>

                        <div className="input-group full-width">

                        <label>Description</label>

                        <textarea
                          name="description"
                          placeholder="Describe your work..."
                          value={item.description}
                          onChange={(e) =>
                            handleExperienceChange(index, e)
                          }
                        ></textarea>

                        </div>

                    </div>


                    {
                    experienceList.length > 1 &&

                    <button
                        type="button"
                        className="remove-btn"
                        onClick={() => {
                        const updatedList = [...experienceList];
                        updatedList.splice(index, 1);
                        setExperienceList(updatedList);
                        }}
                    >
                        Remove Experience
                    </button>
                    }


                    </div>
                ))
                }

                <button
                className="add-btn"
                onClick={() =>
                  setExperienceList([
                    ...experienceList,
                    {
                      experienceType: "",
                      role: "",
                      companyName: "",
                      duration: "",
                      description: ""
                    }
                  ])
                }
                >
                + Add Experience
                </button>


            </div>
        }

        {/* PAGE 4 */}

        {
            page === 4 &&

            <div className="scroll-page">

                <div className="education-card">

                <h3 className="section-title">
                    Resume & Professional Links
                </h3>

                <div className="form-grid">

                    <div className="input-group full-width">

                    <label>Upload Resume</label>

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        setResume(e.target.files[0])
                      }
                    />

                    </div>

                    <div className="input-group">

                    <label>LinkedIn Profile</label>

                    <input
                        type="text"
                        name="linkedin"
                        placeholder="Enter LinkedIn URL"
                        value={profileData.linkedin}
                        onChange={handleChange}
                    />

                    </div>

                    <div className="input-group">

                    <label>GitHub Profile</label>

                    <input
                        type="text"
                        name="github"
                        placeholder="Enter GitHub URL"
                        value={profileData.github}
                        onChange={handleChange}
                    />

                    </div>

                    <div className="input-group">

                    <label>Portfolio Website</label>

                    <input
                        type="text"
                        name="portfolio"
                        placeholder="Enter portfolio link"
                        value={profileData.portfolio}
                        onChange={handleChange}
                    />

                    </div>

                    <div className="input-group">

                    <label>LeetCode / HackerRank</label>

                    <input
                        type="text"
                        name="leetcode"
                        placeholder="Enter coding profile link"
                        value={profileData.leetcode}
                        onChange={handleChange}
                    />

                    </div>

                    <div className="input-group">

                    <label>Languages Known</label>

                    <input
                        type="text"
                        name="languages"
                        placeholder="English, Hindi..."
                        value={profileData.languages}
                        onChange={handleChange}
                    />

                    </div>



                </div>

                </div>

            </div>
            }



        <div className="button-group">

          {
            page > 1 &&

            <button
              className="back-btn"
              onClick={() => setPage(page - 1)}
            >
              Back
            </button>
          }

          {
            page < 4 ?

            <button
              className="next-btn"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>

            :

            <button
              className="save-btn"
              onClick={saveProfile}
            >
              Save Profile
            </button>
          }

        </div>

      </div>

    </div>
    
    {
      success &&

      <div className="popup-overlay">

        <div className="popup-box">

          <h2>
            {success}
          </h2>

          <button
            type="button"
            onClick={() => {
            setSuccess("");
            navigate("/userdashboard");
          }}
            className="popup-btn"
          >
            OK
          </button>

        </div>

      </div>
        }

    </>

  );
};

export default ProfileSetup;