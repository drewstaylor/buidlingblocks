pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "./Stones.sol";

contract SteppingStonesInterface{
    enum AgeGroup {PreSchool,Elementary,Secondary}

    enum CourseStream {Math, Science, Reading}

      struct Teacher {
        string Name;
        address teacherAddress;
    }

    struct Student {
        string Name;
        AgeGroup ageGroup;
        address studentAddress;
    }
}

contract SteppingStones is SteppingStonesInterface,Stones {

    address[] public teachers;
    address[] public students;
    address[] public courses;

    mapping(address => bool) isTeacher;
    mapping(address => bool) isStudent;
    mapping(address => bool) isCourse;

    event teacherRegistered(address teacher);
    event studentRegistered(address student);
    event courseRegistered(address courseContract, address teacher);

    mapping(address => address[]) public coursesByTeacher;

    function registerTeacher() public{
        require(!isTeacher[msg.sender]);
        teachers.push(msg.sender);
        isTeacher[msg.sender]= true;
        emit teacherRegistered(msg.sender);
    }

    function registerStudent() public{
        require(!isStudent[msg.sender]);
        students.push(msg.sender);
        isStudent[msg.sender]= true;
        emit studentRegistered(msg.sender);
    }

    function launchCourse(AgeGroup _ageGroup, CourseStream _courseStream) public {

        Course c = new Course(_ageGroup,_courseStream, msg.sender);
        courses.push(address(c));
        coursesByTeacher[msg.sender].push(address(c));

        isCourse[address(c)] == true;

        emit courseRegistered(address(c), msg.sender);
    }

     function getCoursesByTeacher(address teacher) public view returns(address[] memory courseList){
        return coursesByTeacher[teacher];
    }

    function getTeacher(uint index)  public view returns (address){
        return teachers[index];
    }

    function getStudent(uint index)  public view returns (address){
        return teachers[index];
    }

    function getCourse(uint index)  public view returns (address){
        return teachers[index];
    }

    function getTeacherLength() public view returns (uint){
        return teachers.length;
    }
      function getStudentsLength() public view returns (uint){
        return students.length;
    }
      function getCoursesLength() public view returns (uint){
        return courses.length;
    }



    //Stones
    event minting(address, uint);
    event burning(address, uint);

    function mint(address recipient, uint value) external {
        require(isCourse[msg.sender]);
        create(recipient,value);
    }

    function burn(address recipient, uint value) external {
        require(isCourse[msg.sender]);
        destroy(recipient,value);
    }

    //Verifiers



}

contract Course is SteppingStonesInterface{


    // hash correct answers
    string public Name;
    SteppingStones SteppingStonesContract;

    AgeGroup ageGroup;
    CourseStream courseStream;
    address public teacher;

    step[] steps;
    Test[] tests;


    struct step {
        bytes32 textHash;
        bytes32 imageHash;

    }

    struct Test {
        string[] questions;
        bytes32[] answers;
        string[][] options;
        mapping(address => bytes32[]) responses;
        mapping(address => uint) testScores;
        address[] testTakers;
    }

    constructor (AgeGroup _ageGroup, CourseStream _courseStream, address _teacher) public{
        ageGroup = _ageGroup;
        courseStream = _courseStream;
        teacher = _teacher;
        SteppingStonesContract = SteppingStones(msg.sender);
    }
        //teachers


    function addStep(bytes32 textHash, bytes32 imageHash) public {
        uint stepIndex = steps.length;
        steps[stepIndex].textHash = textHash;
        steps[stepIndex].imageHash = imageHash;
    }

    function addSteps(bytes32[] memory textHashes, bytes32[] memory imageHashes) public {
        require(textHashes.length==imageHashes.length);
        for (uint i=0;i<imageHashes.length;i++){
            addStep(textHashes[i],imageHashes[i]);
        }
    }

    function addTest(string[] memory questionTexts, bytes32[] memory answers, string[][] memory options) public{
        uint testIndex = tests.length;
        tests[testIndex].questions = questionTexts;
        tests[testIndex].answers = answers;
        tests[testIndex].options = options;
    }

    function getStudentTestScore(uint testID, address student) public view returns(uint testScore){
        return tests[testID].testScores[student];
    }

    function getAllTestScores(uint testID) public view returns(uint[] memory testScores){
        uint[] memory allTestScores;
        for(uint i=0; i<tests[testID].testTakers.length;i++){
            address testTaker = tests[testID].testTakers[i];
            allTestScores[i] = tests[testID].testScores[testTaker];
        }
        return allTestScores;
    }

    //students
    function submitResponses(uint testID, bytes32[] memory responses) public{
       require(responses.length == tests[testID].questions.length);
       require(tests[testID].responses[msg.sender].length==0);
       tests[testID].responses[msg.sender] = responses;

       for(uint i = 0; i<responses.length;i++){
           if(responses[i]==tests[testID].answers[i]){
               tests[testID].testScores[msg.sender]+=1;
           }
       }
       SteppingStonesContract.mint(msg.sender,tests[testID].testScores[msg.sender]);
    }

    function getTestScore(uint testID) public view returns (uint){
        return tests[testID].testScores[msg.sender];
    }

    //internal contract





}
