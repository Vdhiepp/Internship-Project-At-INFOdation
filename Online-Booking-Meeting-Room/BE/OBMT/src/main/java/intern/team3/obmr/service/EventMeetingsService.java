package intern.team3.obmr.service;

import intern.team3.obmr.domain.MeetingRooms;
import intern.team3.obmr.service.dto.EventMeetingsDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link intern.team3.obmr.domain.EventMeetings}.
 */
public interface EventMeetingsService {
    // Lấy danh sách các sự kiện mà một người dùng tham gia theo username
    List<EventMeetingsDTO> findEventsByUsername(String username);
    void createEventAndAddUserToEvent(String title, LocalDateTime startTime, LocalDateTime endTime, String description, Long meetingRoomId);
    List<EventMeetingsDTO> findAll();
    /**
     * Save a eventMeetings.
     *
     * @param eventMeetingsDTO the entity to save.
     * @return the persisted entity.
     */
    EventMeetingsDTO save(EventMeetingsDTO eventMeetingsDTO);

    /**
     * Partially updates a eventMeetings.
     *
     * @param eventMeetingsDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventMeetingsDTO> partialUpdate(EventMeetingsDTO eventMeetingsDTO);

    /**
     * Get all the eventMeetings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventMeetingsDTO> findAll(Pageable pageable);

    /**
     * Get the "id" eventMeetings.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventMeetingsDTO> findOne(Long id);

    /**
     * Delete the "id" eventMeetings.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
