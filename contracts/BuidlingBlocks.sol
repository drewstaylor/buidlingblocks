pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "./SteppingStones.sol";

interface enumInterface{
    enum CourseType { Math, Science, Reading}
     enum AgeGroup {Preschool, Elementary,Secondary}
}

contract BuidlingBlocks is SteppingStones,enumInterface {

    address[] public teachers;
    address[] public students;

    address[] public courses;

    CourseType[] public courseTypes;
    string[] public names;

    function getCourseNames() public view returns(string[] memory){
        return names;
    }

    function getCourseTypes() public view returns(CourseType[] memory){
        return courseTypes;
    }

    function namesAndTypes() public view returns(string[] memory, CourseType[] memory){
        return (names,courseTypes);
    }

    mapping(address => bool) public isTeacher;
    mapping(address => bool) public isStudent;
    mapping(address => bool) public isCourse;

    event teacherRegistered(address teacher);
    event studentRegistered(address student);
    event courseLaunched(address courseContract, address teacher, string courseTitle);

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


    function launchCourse(bytes32 courseHash, string memory Name, CourseType _courseType, AgeGroup _ageGroup, bytes32[] memory answers) public {

        Course c = new Course(msg.sender,courseHash, Name, _courseType, _ageGroup, answers);
        courses.push(address(c));
        coursesByTeacher[msg.sender].push(address(c));

        isCourse[address(c)] = true;
        courseTypes.push(_courseType);
        names.push(Name);
        courseTypes.push(_courseType);

        emit courseLaunched(address(c), msg.sender,Name);
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
    event minted(address, uint);
    event burnt(address, uint);

    function mint(address recipient, uint value) public {
        require(isCourse[msg.sender]);
        create(recipient,value);
        emit minted(recipient, value);
    }

    function burn(address sender, uint value) public {
        require(isCourse[msg.sender]);
        destroy(sender,value);
        emit burnt(sender,value);
    }

    //Verifiers

    function getCourseData(uint index) public view returns(bytes32 courseHash,string memory courseTitle,CourseType courseType, AgeGroup ageGroup, bytes32[] memory answers) {
        return Course(courses[index]).getCourseData();
    }



}



contract Course is enumInterface{


    // hash correct answers
    string public courseTitle;
    BuidlingBlocks BuidlingBlocksContract;

    address public teacher;

    CourseType public courseType;
    AgeGroup public ageGroup;

    bytes32 courseHash;

    constructor (address _teacher, bytes32 _courseHash, string memory _courseTitle, CourseType _courseType, AgeGroup _ageGroup, bytes32[] memory _answers) public{
        teacher = _teacher;
        BuidlingBlocksContract = BuidlingBlocks(msg.sender);
        courseTitle = _courseTitle;
        courseHash = _courseHash;
        answers = _answers;
        courseType = _courseType;
        ageGroup = _ageGroup;
        numQuestions = answers.length;
    }
        //teachers
        uint public numQuestions;
        bytes32[] answers;

        mapping(address => bytes32[]) responses;
        mapping(address => uint) public testScores;
        address[] public testTakers;

        mapping(address => bool) hasTakenTest;


    function getStudentTestScore(address student) public view returns(uint testScore){
        return testScores[student];
    }

    function getAllTestScores(uint testID) public view returns(uint[] memory Scores){

    }

    //students
    event testTaken(address student,uint score,uint maxScore);

    function submitResponses(bytes32[] memory _responses) public{
       require(_responses.length == answers.length);
       require(hasTakenTest[msg.sender]==false);
       responses[msg.sender] = _responses;

       for(uint i = 0; i<_responses.length;i++){
           if(_responses[i]==answers[i]){
               testScores[msg.sender]+=1;
           }
       }
       emit testTaken(msg.sender, testScores[msg.sender],_responses.length);
       BuidlingBlocksContract.mint(msg.sender,testScores[msg.sender]);
    }

    function getTestScore() public view returns (uint){
        return testScores[msg.sender];
    }

    function getCourseData() public view returns(bytes32 ,string memory ,CourseType, AgeGroup,bytes32[] memory answers) {
        return(courseHash,courseTitle,courseType,ageGroup,answers);
    }
    //internal contract

}
