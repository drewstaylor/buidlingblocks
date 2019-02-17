pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

contract BuidlingBlockInterface{
    enum AgeGroup {one,two,three}

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

contract BuidlingBlocks is BuidlingBlockInterface {

    address[] public teachers;
    address[] public students;
    address[] public courses;

    mapping(address => address[]) public coursesByTeacher;

    constructor() public {

    }
    event teacherRegistered(address teacher);

    function registerTeacher() public{
        teachers.push(msg.sender);
        emit teacherRegistered(msg.sender);
    }

    function registerStudent() public{
        students.push(msg.sender);
    }

    event newCourse(address CourseContract, address Teacher);
    function launchCourse(AgeGroup _ageGroup, CourseStream _courseStream) public {

        Course c = new Course(_ageGroup,_courseStream, msg.sender);
        courses.push(address(c));
        coursesByTeacher[msg.sender].push(address(c));

        emit newCourse(address(c), msg.sender);
    }

     function getCoursesByTeacher(address teacher) public view returns(address[] memory courses){
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

}

contract Course is BuidlingBlockInterface{


    // hash correct answers
    string Name;

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


    constructor (AgeGroup _ageGroup, CourseStream _courseStream, address teacher) public{
        ageGroup = _ageGroup;
        courseStream = _courseStream;
        teacher = teacher;
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
       tests[testID].responses[msg.sender] = responses;
    }

    function getTestScore(uint testID) public view returns (uint){
        return tests[testID].testScores[msg.sender];

    }

    //all

}
